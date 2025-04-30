const statesData = require('../models/statesData.json');

const jsonMessage = (req, res, attribute) => {
    const code = req.params.state.toUpperCase();
    const state = statesData.find(st => st.code === code);

    if (!state) {
        return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }

    switch (attribute) {
        case 'capital':
            res.json({ state: state.state, capital: state.capital });
            break;
        case 'nickname':
            res.json({ state: state.state, nickname: state.nickname });
            break;
        case 'population':
            res.json({ state: state.state, population: Number(state.population).toLocaleString() });
            break;
        case 'admission':
            const admissionDate = new Date(state.admission_date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = admissionDate.toLocaleDateString('en-US', options);
            res.json({ state: state.state, admitted: formattedDate });
            break;
        default:
            res.status(400).json({ message: 'Invalid attribute requested' });
    }
};

module.exports = jsonMessage;
