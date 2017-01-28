import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import urlParams from '../utilities/url-params';

const initialState = Immutable([]);

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GUIDE_MESSAGE_RECEIVED:
      if (action.data && urlParams.showITS === "true") {
        return state.concat(action.data.message.asString());
      }
      else
        return state;
    // For now, clear all messages every time the user does anything else
    default:
      return initialState;
  }
}
