import expect from 'expect';
import reducer from '../../src/code/reducers/reducer';
import { navigateToChallenge, actionTypes as types } from '../../src/code/actions';

describe('navigateToChallenge action', () => {
  it('should create the correct action when we navigate to a challenge', () => {
    const _case = 2,
          challenge = 3;

    let actionObject = navigateToChallenge(_case, challenge);

    expect(actionObject).toEqual({
      type: types.NAVIGATED,
      case: _case,
      challenge,
      route: "/3/4"
    });
  });

  describe('the reducer', () => {
    it('should update the state to match the authored state when we navigate', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        case: 0,
        challenge: 0,
        authoring: [
          [],
          [{}, {}, {
            template: "GenomePlayground",
            "initialDrake": {
              "alleles": "a:T,b:T",
              "sex": 1
            }
          }]
        ]
      });

      let nextState = reducer(initialState, navigateToChallenge(1, 2));

      expect(nextState).toEqual(initialState.merge({
        case: 1,
        challenge: 2,
        template: "GenomePlayground",
        challengeComplete: false,
        challenges: 3,
        trialSuccess: false,

        // punt on these, as they're not part of the test
        challengeProgress: nextState.challengeProgress,
        drakes: nextState.drakes,
        trials: nextState.trials,
        goalMoves: nextState.goalMoves
      }));
    });
  });
});
