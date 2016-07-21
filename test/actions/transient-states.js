import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('addTransientState and removeTransientState actions', () => {

  describe('the reducer', () => {

    let defaultState = reducer(undefined, {}),
        nextState = null;

    it('should append new transient states when addTransientState is called', () => {

      nextState = reducer(defaultState, {
        type: types.ADD_TRANSIENT_STATE,
        transientState: "state-1"
      });

      expect(nextState).toEqual(defaultState.merge({
        transientStates: ["state-1"]
      }));

      nextState = reducer(nextState, {
        type: types.ADD_TRANSIENT_STATE,
        transientState: "state-2"
      });

      expect(nextState).toEqual(defaultState.merge({
        transientStates: ["state-1", "state-2"]
      }));
    });

    it('should remove transient states when removeTransientState is called', () => {

      nextState = reducer(nextState, {
        type: types.REMOVE_TRANSIENT_STATE,
        transientState: "state-1"
      });

      expect(nextState).toEqual(defaultState.merge({
        transientStates: ["state-2"]
      }));

      nextState = reducer(nextState, {
        type: types.REMOVE_TRANSIENT_STATE,
        transientState: "state-2"
      });

      expect(nextState).toEqual(defaultState.merge({
        transientStates: []
      }));
    });
  });
});
