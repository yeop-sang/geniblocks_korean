import actionTypes from '../action-types';
import { GUIDE_CONNECTED, GUIDE_ERRORED,
  GUIDE_HINT_RECEIVED, GUIDE_ALERT_RECEIVED, ADVANCE_NOTIFICATIONS } from '../modules/notifications';
import { GUIDE_REMEDIATION_REQUESTED} from '../modules/remediation';

const initialState = true;

export default function userDrakeHidden(state = initialState, action) {
  switch (action.type) {
    // Right now the drake is always hidden unless we are displaying a message
    case actionTypes.MODAL_DIALOG_SHOWN:
    case actionTypes.NOTIFICATIONS_SHOWN:
      return false;
    // The following actions don't change the state:
    case GUIDE_CONNECTED:
    case GUIDE_ERRORED:
    case GUIDE_HINT_RECEIVED:
    case GUIDE_ALERT_RECEIVED:
    case GUIDE_REMEDIATION_REQUESTED:
    case ADVANCE_NOTIFICATIONS:
      return state;
    // All other actions re-hide the drake
    default:
      return true;
  }
}
