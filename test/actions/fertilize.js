import expect from 'expect';
import * as actions from '../../src/code/actions';
import reducer from '../../src/code/reducers/';

const types = actions.actionTypes;

describe('fertilize action', () => {
  it('should create an action for fertilizing', () => {
    expect(actions.fertilize(0, 1)).toEqual({
      type: types.FERTILIZED,
      gamete1: 0,
      gamete2: 1
    });
  });

  describe('the reducer', () => {
    it('should breed a new drake given the gametes', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        drakes: [
          { alleleString: "a:t,b:T,a:m,b:M,a:w,b:W,a:h,b:H,a:c,b:C,a:b,b:B,a:fl,b:Fl,a:hl,b:Hl,a:a,b:A1,a:d,b:D,a:bog,b:Bog,a:Rh,b:rh", sex: 1 },
          { alleleString: "a:T,b:t,a:M,b:m,a:W,b:w,a:H,b:h,a:C,b:c,a:B,b:b,a:Fl,b:fl,a:Hl,b:hl,a:A1,b:A2,a:D,a:Bog,a:rh", sex: 0 }
        ],
        gametes: {
          currentGametes: [
            {
              '1': 'a',
              '2': 'b',
              XY: 'y'
            },
            {
              '1': 'b',
              '2': 'b',
              XY: 'x2'
            }
          ]
        }
      });

      let nextState = reducer(initialState, {
        type: types.FERTILIZED,
        gamete1: 0,
        gamete2: 1
      });

      let offspring = nextState.drakes[2];

      expect(offspring.sex).toEqual(0);
      expect(offspring.alleleString).toEqual("a:T,a:M,a:W,a:H,a:C,a:B,a:Fl,a:Hl,a:A1,a:D,a:Bog,a:rh,b:T,b:M,b:W,b:H,b:c,b:b,b:fl,b:hl,b:A2,");
    });
  });

});
