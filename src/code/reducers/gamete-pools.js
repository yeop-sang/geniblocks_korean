import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';

// array of two arrays, 0: father's gametes, 1: mother's gametes
const initialState = Immutable([Immutable([]), Immutable([])]);

export default function gametes(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GAMETE_POOLS_RESET:
      return initialState;
    case actionTypes.GAMETES_ADDED_TO_POOL:
      return state.map((pool, index) => {
        return index === action.index
                ? pool.concat(action.gametes)
                : pool;
      });
    default:
      return state;
  }
}
