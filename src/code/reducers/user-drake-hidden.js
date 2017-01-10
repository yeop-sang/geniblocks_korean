import { actionTypes } from '../actions';

const initialState = true;

export default function userDrakeHidden(state = initialState, action) {
  switch (action.type) {
    // Right now the drake is always hidden unless we are displaying a message
    case actionTypes.MODAL_DIALOG_SHOWN:
      return false;
    // The following actions don't change the state:
    case actionTypes.GUIDE_CONNECTED:
    case actionTypes.GUIDE_ERRORED:
    case actionTypes.GUIDE_MESSAGE_RECEIVED:
    case actionTypes.GUIDE_ALERT_RECEIVED:
      return state;
    // All other actions re-hide the drake
    default:
      return true;
  }
}
