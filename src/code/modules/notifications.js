import Immutable from 'seamless-immutable';
import { GAMETES_RESET } from '../modules/gametes';
import actionTypes from '../action-types';

export const GUIDE_CONNECTED = "Guide connected";
export const GUIDE_MESSAGE_RECEIVED = "Guide message received";
export const GUIDE_ALERT_RECEIVED = "Guide alert received";
export const GUIDE_ERRORED = "Guide errored";
export const ADVANCE_NOTIFICATIONS = "Advance notifications";
export const CLOSE_NOTIFICATIONS = "Close notifications";

const initialState = Immutable([]);

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case GUIDE_MESSAGE_RECEIVED:
      if (action.data) {
        return state.concat(action.data.message.asString());
      }
      else
        return state;
    case ADVANCE_NOTIFICATIONS:
      return state.length > 1 ? state.slice(1, state.length) : initialState;
    case CLOSE_NOTIFICATIONS:
      return initialState;
    // actions which don't clear the guide message
    case GAMETES_RESET:
    case actionTypes.MODAL_DIALOG_DISMISSED:
      return state;
    // For now, clear all messages every time the user does anything else
    default:
      return initialState;
  }
}

export function advanceNotifications() {
  return {
    type: ADVANCE_NOTIFICATIONS
  };
}

export function closeNotifications() {
  return {
    type: CLOSE_NOTIFICATIONS
  };
}