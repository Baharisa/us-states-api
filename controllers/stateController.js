// controllers/stateController.js

const State = require('../models/State'); // MongoDB model
const statesData = require('../models/statesData.json'); // static JSON data
const getStateName = require('../middleware/getStateName');

// @desc Get all states
const getAllStates = async (req, res) => {
  try {
    const mongoStates = await State.find();
    let jsonStates = [...statesData];

    // Merge funfacts from MongoDB
    jsonStates.forEach(state => {
      const match = mongoStates.find(m => m.stateCode === state.code);
      if (match?.funfacts?.length > 0) {
        state.funfacts = match.funfacts;
      }
    });

    // Handle contig query
    const contig = req.query.contig;
    if (contig === 'true') {
      jsonStates = jsonStates.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
      jsonStates = jsonStates.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    res.json(jsonStates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get a single state
const getState = async (req, res) => {
  const code = req.code;
  const jsonState = statesData.find(state => state.code === code);

  if (!jsonState) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  try {
    const mongoState = await State.findOne({ stateCode: code });
    const resultState = { ...jsonState };

    if (mongoState?.funfacts?.length > 0) {
      resultState.funfacts = mongoState.funfacts;
    }

    res.json(resultState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get random funfact
const getFunfact = async (req, res) => {
  const code = req.code;
  const jsonState = statesData.find(state => state.code === code);

  if (!jsonState) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  try {
    const mongoState = await State.findOne({ stateCode: code });
    const stateName = jsonState.state;

    if (!mongoState?.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
    }

    const randomFact = mongoState.funfacts[Math.floor(Math.random() * mongoState.funfacts.length)];
    res.json({ funfact: randomFact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Create new funfacts
const createNewFunfacts = async (req, res) => {
  const code = req.code;
  const { funfacts } = req.body;

  if (!funfacts) return res.status(400).json({ message: "State fun facts value required" });
  if (!Array.isArray(funfacts)) return res.status(400).json({ message: "State fun facts value must be an array" });

  try {
    let state = await State.findOne({ stateCode: code });

    if (state) {
      state.funfacts.push(...funfacts);
      const updatedState = await state.save();
      return res.json(updatedState);
    }

    const newState = await State.create({ stateCode: code, funfacts });
    res.status(201).json(newState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Update funfact
const updateFunfact = async (req, res) => {
  const code = req.code;
  const { index, funfact } = req.body;

  if (index === undefined) return res.status(400).json({ message: "State fun fact index value required" });
  if (!funfact) return res.status(400).json({ message: "State fun fact value required" });

  try {
    const mongoState = await State.findOne({ stateCode: code });
    const stateName = getStateName(code);

    if (!mongoState?.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
    }

    if (index < 1 || index > mongoState.funfacts.length) {
      return res.status(400).json({ message: `No Fun Fact found at that index for ${stateName}` });
    }

    mongoState.funfacts[index - 1] = funfact;
    const updatedState = await mongoState.save();
    res.json(updatedState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Delete funfact
const deleteFunfact = async (req, res) => {
  const code = req.code;
  const { index } = req.body;

  if (index === undefined) return res.status(400).json({ message: "State fun fact index value required" });

  try {
    const mongoState = await State.findOne({ stateCode: code });
    const stateName = getStateName(code);

    if (!mongoState?.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
    }

    if (index < 1 || index > mongoState.funfacts.length) {
      return res.status(400).json({ message: `No Fun Fact found at that index for ${stateName}` });
    }

    mongoState.funfacts.splice(index - 1, 1);
    const updatedState = await mongoState.save();
    res.json(updatedState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get capital
const getCapital = (req, res) => {
  const code = req.code;
  const state = statesData.find(st => st.code === code);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  res.json({ state: state.state, capital: state.capital_city });
};

// @desc Get nickname
const getNickname = (req, res) => {
  const code = req.code;
  const state = statesData.find(st => st.code === code);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  res.json({ state: state.state, nickname: state.nickname });
};

// @desc Get population
const getPopulation = (req, res) => {
  const code = req.code;
  const state = statesData.find(st => st.code === code);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  res.json({ state: state.state, population: Number(state.population).toLocaleString('en-US') });
};

// @desc Get admission date (ISO format: YYYY-MM-DD)
const getAdmission = (req, res) => {
  const code = req.code;
  const state = statesData.find(st => st.code === code);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  res.json({ state: state.state, admitted: state.admission_date });
};

module.exports = {
  getAllStates,
  getState,
  getFunfact,
  createNewFunfacts,
  updateFunfact,
  deleteFunfact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission
};
