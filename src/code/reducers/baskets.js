import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';

const initialState = Immutable([]);

export default function baskets(state = initialState, action) {
  let basket, eggs, newEggs;
  switch (action.type) {
    case actionTypes.BASKET_SELECTION_CHANGED:
      return state.map((basket, index) => {
        if (basket == null) return basket;
        const wasSelected = !!basket.isSelected,
              isSelected = (action.selectedIndices != null) && 
                            (action.selectedIndices.indexOf(index) >= 0);
        let newBasket = basket;
        if (isSelected !== wasSelected) {
          newBasket = basket.asMutable();
          newBasket.isSelected = isSelected;
        }
        return newBasket;
      });
    case actionTypes.EGG_ACCEPTED:
      basket = state[action.basketIndex];
      eggs = basket && basket.eggs;
      newEggs = eggs ? eggs.concat(action.eggDrakeIndex) : Immutable([action.eggDrakeIndex]);
      return state.setIn([action.basketIndex, 'eggs'], newEggs);
    default:
      return state;
  }
}
