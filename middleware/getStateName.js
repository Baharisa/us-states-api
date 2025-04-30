 
const statesData = require('../models/statesData.json');

const getStateName = (code) => {
    const state = statesData.find(st => st.code === code.toUpperCase());
    return state?.state || null;
};

module.exports = getStateName;