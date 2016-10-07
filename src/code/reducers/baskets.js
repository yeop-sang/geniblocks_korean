import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';

const initialState = Immutable([]);

export default function baskets(state = initialState, action) {
  let basket, eggs, newEggs;
  switch (action.type) {
    case actionTypes.EGG_ACCEPTED:
      basket = state[action.basketIndex];
      eggs = basket && basket.eggs;
      newEggs = eggs ? eggs.concat(action.eggIndex) : Immutable([action.eggIndex]);
      return state.setIn([action.basketIndex, 'eggs'], newEggs);
    default:
      return state;
  }
}
