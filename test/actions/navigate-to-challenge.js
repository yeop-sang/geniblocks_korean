import expect from 'expect';
import reducer from '../../src/code/reducers/';
import { navigateToChallenge, actionTypes as types } from '../../src/code/actions';

describe('navigateToChallenge action', () => {
  it('should create the correct action when we navigate to a challenge', () => {
    const level = 4,
          mission = 2,
          challenge = 3;

    let actionObject = navigateToChallenge({level, mission, challenge});

    expect(actionObject).toEqual({
      type: types.NAVIGATED,
      mission: mission,
      level: level,
      challenge,
      route: "/5/3/4",
      meta: {
        "itsLog": {
          "actor": "USER",
          "action": "NAVIGATED",
          "target": "CHALLENGE"
        },
        logTemplateState: true
      }
    });
  });

  describe('the reducer', () => {
    it('should update the state to match the authored state when we navigate', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0, mission: 0, challenge: 0},
        authoring: {
          "challenges": {
            "test": {
              template: "GenomePlayground",
              "initialDrake": {
                "alleles": "a:T,b:T",
                "sex": 1
              }
            }, "empty": {}},
          "application": {
            "levels": [
              {
                "missions": [
                  {
                    "challenges": []
                  },
                  {
                    "challenges": [{"id": "empty"}, {"id": "empty"}, {"id": "test"}]
                  }
                ]
              }
            ]
          }
        }
      });

      let nextState = reducer(initialState, navigateToChallenge({level: 0, mission: 1, challenge: 2}));

      // By starting with nextState and merging in what we expect, we eliminate
      // all other properties from consideration. This is particularly an issue
      // for challenge navigation, which triggers loadStateFromAuthoring(), which
      // makes a large number of changes to the state that have nothing to do with
      // the navigation action itself. These loadStateFromAuthoring() changes tend
      // to change frequently, at least during these early days of new challenge
      // development. Requiring navigation unit tests to be modified whenever 
      // loadStateFromAuthoring() changes leads to brittle unit tests. If one
      // wanted to unit test the loadStateFromAuthoring() changes, it could be
      // done with a unit test of that function directly.
      expect(nextState).toEqual(nextState.merge({
        routeSpec: {level: 0, mission: 1, challenge: 2},
        template: "GenomePlayground",
        challenges: 3,
        trialSuccess: false,
      }));
    });
  });
});
