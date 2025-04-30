const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/stateController');

//  ADD THIS at the top:
const verifyState = require('../../middleware/verifyState');

// Route to get all states (no verifyState needed)
router.route('/')
    .get(statesController.getAllStates);

// Route to get specific state
router.route('/:state')
    .get(verifyState, statesController.getState);

// Route for fun facts
router.route('/:state/funfact')
    .get(verifyState, statesController.getFunfact)
    .post(verifyState, statesController.createNewFunfacts)
    .patch(verifyState, statesController.updateFunfact)
    .delete(verifyState, statesController.deleteFunfact);

// Route for state capital
router.route('/:state/capital')
    .get(verifyState, statesController.getCapital);

// Route for state nickname
router.route('/:state/nickname')
    .get(verifyState, statesController.getNickname);

// Route for state population
router.route('/:state/population')
    .get(verifyState, statesController.getPopulation);

// Route for state admission date
router.route('/:state/admission')
    .get(verifyState, statesController.getAdmission);

module.exports = router;