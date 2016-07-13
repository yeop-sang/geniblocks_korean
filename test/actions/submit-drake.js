import expect from 'expect';
import reducer from '../../src/code/reducers/reducer';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('submitDrake action', () => {
  it('should create the correct action when the drake is submitted correctly', () => {
    const correctPhenotype = [{armor: "Five armor"}],
          submittedPhenotype = [{armor: "Five armor"}],
          correct = true;

    let actionObject = actions.submitDrake(correctPhenotype, submittedPhenotype, correct);

    expect(actionObject).toEqual({
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

  it('should create the correct action when the drake is submitted incorrectly', () => {
    const correctPhenotype = [{armor: "Five armor"}],
          submittedPhenotype = [{armor: "Three armor"}],
          correct = false;

    let actionObject = actions.submitDrake(correctPhenotype, submittedPhenotype, correct);

    expect(actionObject).toEqual({
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
        showingInfoMessage: true,
        userDrakeHidden: false,
        trialSuccess: false,
        challengeComplete: false,
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
          showingInfoMessage: true,
          userDrakeHidden: false,
          trialSuccess: true,
          challengeComplete: false,
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
          showingInfoMessage: true,
          userDrakeHidden: false,
          trialSuccess: true,
          challengeComplete: true,
          challengeProgress: {
            "0:0:0" : 0,
            "0:0:1" : 1
          }
        }));
      });
    });
  });
});
