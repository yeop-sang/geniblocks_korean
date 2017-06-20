import actionTypes from '../action-types';

const initialState = false;

export default function trialSuccess(state = initialState, action) {
  switch(action.type) {
    case actionTypes.OFFSPRING_KEPT:
    case actionTypes.DRAKE_SUBMITTED:
    case actionTypes.EGG_SUBMITTED:
      return action.correct;
    case actionTypes.ZOOM_CHALLENGE_WON:
      return true;
    default:
      return state;
  }
}
