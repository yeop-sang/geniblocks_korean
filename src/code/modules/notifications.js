import Immutable from 'seamless-immutable';
import { GAMETES_RESET } from '../modules/gametes';
import urlParams from '../utilities/url-params';

export const GUIDE_CONNECTED = "Guide connected";
export const GUIDE_MESSAGE_RECEIVED = "Guide message received";
export const GUIDE_ALERT_RECEIVED = "Guide alert received";
export const GUIDE_ERRORED = "Guide errored";

const initialState = Immutable([]);

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case GUIDE_MESSAGE_RECEIVED:
      if (action.data && urlParams.showITS === "true") {
        return state.concat(action.data.message.asString());
      }
      else
        return state;
    // actions which don't clear the guide message
    case GAMETES_RESET:
      return state;
    // For now, clear all messages every time the user does anything else
    default:
      return initialState;
  }
}
