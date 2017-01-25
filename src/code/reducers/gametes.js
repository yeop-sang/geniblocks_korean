import Immutable from 'seamless-immutable';
import { clone } from 'lodash';
import actionTypes from '../action-types';
import { GAMETE_SELECTED } from '../modules/parent-gametes';

const initialState = Immutable([]);

export default function gametes(state = initialState, action) {
  switch (action.type) {
    case GAMETE_SELECTED:
      return state.map((gamete, index) => {
                return index === action.sex
                        ? (action.gamete ? clone(action.gamete) : {})
                        : gamete;
              });
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
