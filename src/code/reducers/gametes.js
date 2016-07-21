import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';

const initialState = Immutable([]);

export default function gametes(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GAMETE_CHROMOSOME_ADDED:
      return state.setIn([action.index, action.name], action.side);
    case actionTypes.GAMETES_RESET:
      return Immutable([{}, {}]);
    case actionTypes.OFFSPRING_KEPT:
      if (action.success) {
        return Immutable([{}, {}]);
      } else return state;
    default:
      return state;
  }
}
