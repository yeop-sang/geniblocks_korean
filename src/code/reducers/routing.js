import Immutable from 'seamless-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = Immutable({});

export default function modalDialog(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE: {
      return state.set("locationBeforeTransitions", action.payload);
    }
    default:
      return state;
  }
}
