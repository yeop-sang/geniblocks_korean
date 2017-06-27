import actionTypes from '../action-types';

const initialState = 0;

/**
 * challengeErrors is the score a user would receive if they were to successfully
 * complete the challenge at that moment. It does not need further calculating,
 * as calculations are done in the reducer.
 *
 * It will keep counting up as errors accumulate in a challenge, though the view
 * will show no gem for scores of 3+
 */
export default function challengeErrors(state = initialState, moves, goalMoves, action) {
  switch(action.type) {
    case actionTypes.NAVIGATED:
      return 0;
    case actionTypes.EGG_REJECTED:
      return state + 1;
    default: {
      // for any action that increases moves, increase challengeErrors if we're above
      // goal moves. (Remembering that `moves` has already been set by previous reducers)
      if (action.incrementMoves && goalMoves >= 0 && moves > goalMoves) {
        return state + 1;
      } else {
        return state;
      }
    }
  }
}
