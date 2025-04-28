const statesData = require('../models/statesData.json');
const getStateName = require('./getStateName');

const jsonMessage = (req, res, attribute) => {
    const code = req.code;
    const state = statesData.find(state => state.code === code);
    const stateName = getStateName(code);

    if (!state) {
        return res.status(404).json({ message: `Invalid state abbreviation parameter` });
    }

    let response = { state: stateName };

    // Dynamically add the correct attribute
    switch (attribute) {
        case 'capital':
            response.capital = state.capital_city;
            break;
        case 'nickname':
            response.nickname = state.nickname;
            break;
        case 'population':
            response.population = state.population;
            break;
        case 'admission':
            response.admission_date = state.admission_date;
            break;
        default:
            return res.status(400).json({ message: 'Invalid attribute requested' });
    }

    res.json(response);
};

module.exports = jsonMessage;
