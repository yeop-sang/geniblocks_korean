import actionTypes from '../action-types';
import { GUIDE_CONNECTED, GUIDE_ERRORED,
          GUIDE_MESSAGE_RECEIVED, GUIDE_ALERT_RECEIVED, ADVANCE_NOTIFICATIONS } from '../modules/notifications';

const initialState = true;

export default function parentDrakeHidden(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ALLELE_SELECTED:
      state = state.setIn(["selectedAlleles", action.chromosome, action.side, action.gene], action.newAllele);
      return state;
    case actionTypes.NAVIGATED:
      return state;
    case actionTypes.READY_TO_ANSWER:
      state = state.setIn(["hiddenGenotype"], !action.ready);
      return state;
    case actionTypes.DRAKE_SUBMITTED:
      if (state && state.hiddenImage) state = state.setIn(["hiddenImage"], !action.correct);
      return state;
    default:
      return state;
  }
}
