const statesData = require('../models/statesData.json');

const validCodes = statesData.map(state => state.code);

const isValidStateCode = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    if (!validCodes.includes(stateCode)) {
        return res.status(400).json({ message: "Invalid state abbreviation parameter" });
    }
    req.code = stateCode;
    next();
};

module.exports = isValidStateCode;