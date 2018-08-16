import expect from 'expect';
import * as actions from '../../src/code/actions';
import reducer from '../../src/code/reducers/';

const types = actions.actionTypes;

describe('breedClutch action', () => {
  it('should create an action for breeding a clutch', () => {
    expect(actions.breedClutch(20)).toEqual({
      type: types.CLUTCH_BRED,
      clutchSize: 20,
      meta: {
        itsLog: {
          actor: "USER",
          action: "BRED",
          target: "CLUTCH"
        }
      }
    });
  });

  describe('the reducer', () => {
    it('should add 20 new drakes', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes", [
                            { alleleString: "a:T,b:T", sex: 0 },
                            { alleleString: "a:t,b:t", sex: 1 }
                          ]);

      let nextState = reducer(initialState, {
        type: types.CLUTCH_BRED,
        clutchSize: 20
      });

      expect(nextState.drakes.length).toEqual(22);
    });

    it('should create offspring from the parent drakes', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes", [
                            { alleleString: "a:T,b:T", sex: 0 },
                            { alleleString: "a:t,b:t", sex: 1 }
                          ]);

      let nextState = reducer(initialState, {
        type: types.CLUTCH_BRED,
        clutchSize: 20
      });

      for (let i = 2; i < 22; i++) {
        expect(nextState.drakes[i].alleleString.indexOf("a:T,b:t")).toBeGreaterThan(-1);
      }
    });
  });

});
