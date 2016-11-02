import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('changeBasketSelection action', () => {
  it('should create an action to change basket selection', () => {
    const selectedIndices = [];
    expect(actions.changeBasketSelection(selectedIndices)).toEqual({
      type: types.BASKET_SELECTION_CHANGED,
      selectedIndices,
      meta: {
        itsLog: {
          actor: "USER",
          action: "CHANGED_SELECTION",
          target: "BASKET"
        }
      }
    });
  });

  describe('the reducer', () => {
    it('should select the appropriate basket(s) when passed a BASKET_SELECTION_CHANGED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("baskets", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: false },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ]);

      let nextState = reducer(initialState, {
        type: types.BASKET_SELECTION_CHANGED,
        selectedIndices: [1]
      });

      expect(nextState).toEqual(initialState.setIn(["baskets", 1],
                                                  { alleles: "a:t,b:t", sex: 1, isSelected: true }));
    });

    it('should deselect all basket(s) when passed an empty BASKET_SELECTION_CHANGED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("baskets", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: true },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ]);

      let nextState = reducer(initialState, {
        type: types.BASKET_SELECTION_CHANGED,
        selectedIndices: []
      });

      expect(nextState).toEqual(initialState.setIn(["baskets", 0],
                                                  { alleles: "a:T,b:T", sex: 0, isSelected: false }));
    });
  });

});
