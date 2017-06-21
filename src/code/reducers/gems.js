import actionTypes from '../action-types';
import { getGemFromChallengeErrors } from './helpers/challenge-progress';

const initialState = [];

/**
 * gems is the list of all gems the user has been awarded.
 */
export default function gems(state = initialState, challengeErrors, routeSpec, action) {
  switch(action.type) {
    case actionTypes.CHALLENGE_COMPLETED:
    case actionTypes.CHALLENGE_RETRIED: {
        let { level, mission, challenge } = routeSpec;
        if (!state[level]) {
          state = state.setIn([level], []);
        }
        if (!state[level][mission]) {
          state = state.setIn([level, mission], []);
        }

        let gem = getGemFromChallengeErrors(challengeErrors);
        state = state.setIn([level, mission, challenge], gem);

        return state;
      }
    default:
      return state;
  }
}
