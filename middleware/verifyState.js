// middleware/verifyState.js
const statesData = require('../models/statesData.json');

const verifyState = (req, res, next) => {
  const rawCode = req.params.state;

  if (!rawCode) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  const upperCode = rawCode.toUpperCase();
  const validCodes = statesData.map(state => state.code);

  if (!validCodes.includes(upperCode)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  req.code = upperCode;
  next();
};

module.exports = verifyState;
