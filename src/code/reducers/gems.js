import actionTypes from '../action-types';
import { getGemFromChallengeErrors } from './helpers/gems-helper';

const initialState = [];

/**
 * gems is the list of all gems the user has been awarded.
 */
export default function gems(state = initialState, challengeErrors, routeSpec, action) {
  switch(action.type) {
    case actionTypes.CHALLENGE_COMPLETED:
    case actionTypes.CHALLENGE_RETRIED: {
        let { level: currLevel, mission: currMission, challenge: currChallenge } = routeSpec;
        for (let level = 0; level <= currLevel; level++) {
          if (!state[level]) {
            state = state.setIn([level], []);
          }
        }
        for (let mission = 0; mission <= currMission; mission++) {
          if (!state[currLevel][mission]) {
            state = state.setIn([currLevel, mission], []);
          }
        }
        for (let challenge = 0; challenge <= currChallenge; challenge++) {
          if (isNaN(state[currLevel][currMission][challenge])) {
            state = state.setIn([currLevel, currMission, challenge], null);
          }
        }

        let gem = getGemFromChallengeErrors(challengeErrors);
        state = state.setIn([currLevel, currMission, currChallenge], gem);

        return state;
      }
    case actionTypes.LOAD_SAVED_STATE: {
      if (action.gems && action.gems.length > 0) {
        return action.gems;
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
