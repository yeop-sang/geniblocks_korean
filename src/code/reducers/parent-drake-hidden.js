import actionTypes from '../action-types';
import { GUIDE_CONNECTED, GUIDE_ERRORED,
          GUIDE_MESSAGE_RECEIVED, GUIDE_ALERT_RECEIVED, ADVANCE_NOTIFICATIONS } from '../modules/notifications';

const initialState = true;

export default function parentDrakeHidden(state = initialState, action) {
  switch (action.type) {

    case actionTypes.READY_TO_ANSWER:
      console.log(state, action);
      return state.setIn(["hiddenGenotype"], !action.ready);
    default:
      return state;
  }
}
