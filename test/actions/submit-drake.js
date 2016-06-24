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
      incrementMoves: false
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
      incrementMoves: true
    });
  });

  describe('the reducer', () => {
    it('should update the trialSuccess and challengeComplete property correctly when drake is incorrect', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        trial: 1,
        trials: [{}, {}]
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
        challengeComplete: false
      }));
    });

    describe('when drake is correct', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        trial: 0,
        trials: [{}, {}]
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
          challengeComplete: false
        }));
      });

      it('should update the trialSuccess and challengeComplete property correctly when there are no more trials', () => {
        initialState = initialState.set("trial", 1);
        let nextState = reducer(initialState, submitAction);

        expect(nextState).toEqual(initialState.merge({
          showingInfoMessage: true,
          userDrakeHidden: false,
          trialSuccess: true,
          challengeComplete: true
        }));
      });
    });
  });
});
