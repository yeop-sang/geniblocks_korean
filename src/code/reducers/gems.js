import actionTypes from '../action-types';

const initialState = [];

/**
 * gems is the list of all gems the user has been awarded.
 */
export default function gems(state = initialState, currentGem, routeSpec, action) {
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
        if (isNaN(state[level][mission][challenge]) || state[level][mission][challenge] > currentGem) {
          state = state.setIn([level, mission, challenge], currentGem);
        }
        return state;
      }
    default:
      return state;
  }
}
