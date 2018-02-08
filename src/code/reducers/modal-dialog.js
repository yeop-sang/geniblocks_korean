import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import { GUIDE_ALERT_RECEIVED, GUIDE_MESSAGE_RECEIVED, ADVANCE_NOTIFICATIONS, CLOSE_NOTIFICATIONS } from '../modules/notifications';

const initialState = Immutable({
  show: false,
  leftButton: null,
  rightButton: null,
  bigButtonText: null
});

const defaultRightButton = {
  label: "~BUTTON.OK",
  action: "dismissModalDialog"
};

export default function modalDialog(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MODAL_DIALOG_SHOWN:
      return state.merge({
        show: true,
        rightButton: action.rightButton || defaultRightButton,
        leftButton: action.leftButton,
        bigButtonText: action.bigButtonText,
        showAward: action.showAward
      });
    case actionTypes.TOGGLE_MAP:
      return state.merge({
        show: action.isVisible,
        showMap: action.isVisible,
        showAward: false
      });
    case actionTypes.MODAL_DIALOG_DISMISSED:
      return initialState;
    // actions which don't close the dialog, i.e. that can occur
    // while a dialog is being shown
    case actionTypes.BASKET_SELECTION_CHANGED:
    case actionTypes.DRAKE_SELECTION_CHANGED:
    case actionTypes.NOTIFICATIONS_SHOWN:
    case actionTypes.ADVANCE_NOTIFICATIONS:
    case GUIDE_ALERT_RECEIVED:
    case GUIDE_MESSAGE_RECEIVED:
    case ADVANCE_NOTIFICATIONS:
    case CLOSE_NOTIFICATIONS:
      return state;
    // Assume for now that all other actions also close dialog
    default:
      return initialState;
  }
}
