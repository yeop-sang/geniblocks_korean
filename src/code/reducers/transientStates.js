import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';

const initialState = Immutable([]);

export default function modalDialog(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_TRANSIENT_STATE: {
      return state.concat(action.transientState);
    }

    case actionTypes.REMOVE_TRANSIENT_STATE: {
      return state.filter((s) => s !== action.transientState);
    }
    default:
      return state;
  }
}
