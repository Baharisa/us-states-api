
const statesData = require('../models/statesData.json');

const verifyState = (req, res, next) => {
    const stateParam = req.params.state;
    if (!stateParam) {
        return res.status(400).json({ message: "State abbreviation required" });
    }

    const code = stateParam.toUpperCase();
    const state = statesData.find(st => st.code === code);

    if (!state) {
        return res.status(400).json({ message: "Invalid state abbreviation parameter" });
    }

    req.code = code; // Attach to request
    next();
};

module.exports = verifyState;
