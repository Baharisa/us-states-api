const State = require('../models/State');
const statesData = require('../models/statesData.json');
const getStateName = require('../middleware/getStateName');
const jsonMessage = require('../middleware/jsonMessage');

// @desc Get all states
const getAllStates = async (req, res) => {
    let statesFromMongo = await State.find();
    if (!statesFromMongo) return res.status(204).json({ message: 'No states found' });

    let states = [...statesData];

    states.forEach(state => {
        const mongoState = statesFromMongo.find(st => st.stateCode === state.code);
        if (mongoState && mongoState.funfacts) {
            state.funfacts = mongoState.funfacts;
        }
    });

    if (req.query.contig === 'true') {
        states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (req.query.contig === 'false') {
        states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    res.json(states);
};

// @desc Get a single state
const getState = async (req, res) => {
    const code = req.code;
    const stateData = statesData.find(state => state.code === code);

    const mongoState = await State.findOne({ stateCode: code });
    if (mongoState && mongoState.funfacts) {
        stateData.funfacts = mongoState.funfacts;
    }

    res.json(stateData);
};

// @desc Get capital
const getCapital = (req, res) => {
    jsonMessage(req, res, 'capital');
};

// @desc Get nickname
const getNickname = (req, res) => {
    jsonMessage(req, res, 'nickname');
};

// @desc Get population
const getPopulation = (req, res) => {
    jsonMessage(req, res, 'population');
};

// @desc Get admission (FIXED version)
const getAdmission = (req, res) => {
    const code = req.code;
    const stateData = statesData.find(state => state.code === code);

    if (!stateData) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    const date = new Date(stateData.admission_date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    res.json({
        state: stateData.state,
        admitted: formattedDate
    });
};

// @desc Get random funfact
const getFunfact = async (req, res) => {
    const code = req.code;
    const mongoState = await State.findOne({ stateCode: code });

    const stateName = getStateName(code);

    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.json({ message: `No Fun Facts found for ${stateName}` });
    }

    const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
    res.json({ funfact: mongoState.funfacts[randomIndex] });
};

// @desc Create new funfacts
const createNewFunfacts = async (req, res) => {
    const code = req.code;
    const { funfacts } = req.body;

    if (!funfacts || !Array.isArray(funfacts)) {
        return res.status(400).json({ message: "State fun facts value must be an array" });
    }

    let state = await State.findOne({ stateCode: code });

    if (!state) {
        try {
            state = await State.create({ stateCode: code, funfacts });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        state.funfacts.push(...funfacts);
        await state.save();
    }

    res.json(state);
};

// @desc Update funfact
const updateFunfact = async (req, res) => {
    const code = req.code;
    const { index, funfact } = req.body;

    if (index == null) return res.status(400).json({ message: "State fun fact index value required" });
    if (!funfact) return res.status(400).json({ message: "State fun fact value required" });

    const mongoState = await State.findOne({ stateCode: code });
    const stateName = getStateName(code);

    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.status(400).json({ message: `No Fun Facts found for ${stateName}` });
    }

    const correctedIndex = index - 1;
    if (correctedIndex < 0 || correctedIndex >= mongoState.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${stateName}` });
    }

    mongoState.funfacts[correctedIndex] = funfact;
    await mongoState.save();
    res.json(mongoState);
};

// @desc Delete funfact
const deleteFunfact = async (req, res) => {
    const code = req.code;
    const { index } = req.body;

    if (index == null) return res.status(400).json({ message: "State fun fact index value required" });

    const mongoState = await State.findOne({ stateCode: code });
    const stateName = getStateName(code);

    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.status(400).json({ message: `No Fun Facts found for ${stateName}` });
    }

    const correctedIndex = index - 1;
    if (correctedIndex < 0 || correctedIndex >= mongoState.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${stateName}` });
    }

    mongoState.funfacts.splice(correctedIndex, 1);
    await mongoState.save();
    res.json(mongoState);
};

module.exports = { 
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunfact,
    createNewFunfacts,
    updateFunfact,
    deleteFunfact
};
