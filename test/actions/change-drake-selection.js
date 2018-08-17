import expect from 'expect';
import * as actions from '../../src/code/actions';
import reducer from '../../src/code/reducers/';

const types = actions.actionTypes;

describe('changeDrakeSelection action', () => {
  it('should create an action to change drake selection', () => {
    const selectedIndices = [];
    expect(actions.changeDrakeSelection(selectedIndices)).toEqual({
      type: types.DRAKE_SELECTION_CHANGED,
      selectedIndices
    });
  });

  describe('the reducer', () => {
    it('should select the appropriate drake(s) when passed a DRAKE_SELECTION_CHANGED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: false },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ]);

      let nextState = reducer(initialState, {
        type: types.DRAKE_SELECTION_CHANGED,
        selectedIndices: [1]
      });

      expect(nextState).toEqual(initialState.setIn(["drakes", 1],
                                                  { alleles: "a:t,b:t", sex: 1, isSelected: true }));
    });

    it('should deselect all drake(s) when passed an empty DRAKE_SELECTION_CHANGED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: true },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ]);

      let nextState = reducer(initialState, {
        type: types.DRAKE_SELECTION_CHANGED,
        selectedIndices: []
      });

      expect(nextState).toEqual(initialState.setIn(["drakes", 0],
                                                  { alleles: "a:T,b:T", sex: 0, isSelected: false }));
    });
  });

});
