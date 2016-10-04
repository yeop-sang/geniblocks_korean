import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('submitDrake action', () => {
  describe('when the drake is submitted correctly', () => {
    const correctPhenotype = [{armor: "Five armor"}],
          submittedPhenotype = [{armor: "Five armor"}],
          correct = true;

    const dispatch = expect.createSpy();
    const getState = () => ({case: 0, challenge: 0, trial: 0, trials: [{}], authoring: [[{}]]});

    actions.submitDrake(correctPhenotype, submittedPhenotype, correct)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: types.DRAKE_SUBMITTED,
        correctPhenotype,
        submittedPhenotype,
        correct,
        incrementMoves: false,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "DRAKE"
          }
        }
      });
    });

    it('should call dispatch with the correct message action', () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: types.MODAL_DIALOG_SHOWN,
        message: "~ALERT.TITLE.GOOD_WORK",
        explanation: "~ALERT.COMPLETE_COIN",
        leftButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "retryCurrentChallenge"
        },
        rightButton: {
          label: "~BUTTON.NEXT_CASE",
          action: "navigateToNextChallenge"
        },
        showAward: true,
        top: undefined
      });
    });

  });

  describe('when the drake is submitted incorrectly', () => {
    const correctPhenotype = [{armor: "Five armor"}],
            submittedPhenotype = [{armor: "Three armor"}],
            correct = false;

    const dispatch = expect.createSpy();
    const getState = () => ({case: 0, challenge: 0, trial: 0, trials: [{}], authoring: [[{}]]});

    actions.submitDrake(correctPhenotype, submittedPhenotype, correct)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: types.DRAKE_SUBMITTED,
        correctPhenotype,
        submittedPhenotype,
        correct,
        incrementMoves: true,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "DRAKE"
          }
        }
      });
    });

    it('should call dispatch with the correct message action', () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: types.MODAL_DIALOG_SHOWN,
        message: "~ALERT.TITLE.INCORRECT_DRAKE",
        explanation: "~ALERT.INCORRECT_DRAKE",
        rightButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "dismissModalDialog"
        },
        leftButton: undefined,
        showAward: false,
        top: "475px"
      });
    });

  });

  describe('the reducer', () => {
    it('should update the trialSuccess and challengeComplete property correctly when drake is incorrect', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        trial: 1,
        trials: [{}, {}],
        challengeProgress: {
          "0:0:0" : 2
        }
      });

      let nextState = reducer(initialState, {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: false,
        incrementMoves: false
      });

      expect(nextState).toEqual(initialState.merge({
        trialSuccess: false,
        challengeProgress: {
          "0:0:0" : 2,
          "0:0:1" : -1
        }
      }));
    });

    describe('when drake is correct', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        trial: 0,
        trials: [{}, {}],
        challengeProgress: {
        },
        goalMoves: 3,
        moves: 3
      });
      let submitAction = {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: true,
        incrementMoves: false
      };

      it('should update the trialSuccess and challengeComplete property correctly when there are more trials', () => {
        let nextState = reducer(initialState, submitAction);

        expect(nextState).toEqual(initialState.merge({
          trialSuccess: true,
          challengeProgress: {
            "0:0:0" : 0
          }
        }));
      });

      it('should update the trialSuccess and challengeComplete property correctly when there are no more trials', () => {
        initialState = initialState.set("trial", 1);
        initialState = initialState.set("goalMoves", 4);
        initialState = initialState.set("moves", 5);
        initialState = initialState.set( "challengeProgress", {"0:0:0" : 0} );

        let nextState = reducer(initialState, submitAction);

        expect(nextState).toEqual(initialState.merge({
          trialSuccess: true,
          challengeProgress: {
            "0:0:0" : 0,
            "0:0:1" : 1
          }
        }));
      });
    });
  });
});
