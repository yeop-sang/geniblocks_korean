import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('changeSex action', () => {
  it('should create the correct action when the sex is changed', () => {
    const index = 1,
          newSex = 1,
          incrementMoves = true;

    let actionObject = actions.changeSex(index, newSex, incrementMoves);

    expect(actionObject).toEqual({
      type: types.SEX_CHANGED,
      index,
      newSex,
      incrementMoves,
      meta: {
        "itsLog": {
          "actor": "USER",
          "action": "CHANGED",
          "target": "SEX"
        }
      }
    });
  });

  describe('the reducer', () => {
    it('should update the drakes sex and expand the allele string when passed a SEX_CHANGED action to female', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes",
        [{
          alleleString: "a:T,b:T,a:m,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
          sex: 0,
          secondXAlleles: "b:bog,a:Rh"
        }]);

      let nextState = reducer(initialState, {
        type: types.SEX_CHANGED,
        index: 0,
        newSex: 1,
        incrementMoves: false
      });

      expect(nextState).toEqual(initialState.setIn(["drakes", 0], {
        alleleString: 'a:T,b:T,a:m,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh,b:bog,a:Rh',
        sex: 1,
      }));
    });
  });

  describe('the reducer', () => {
    it('should update the drakes sex and store the allele string when passed a SEX_CHANGED action to male', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes",
        [{
          alleleString: "a:T,b:T,a:m,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,b:D,a:Bog,a:rh,b:bog,b:Rh",
          sex: 1,
        }]);

      let nextState = reducer(initialState, {
        type: types.SEX_CHANGED,
        index: 0,
        newSex: 0,
        incrementMoves: false
      });

      expect(nextState).toEqual(initialState.setIn(["drakes", 0], {
        alleleString: 'a:T,b:T,a:m,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh',
        sex: 0,
        secondXAlleles: "b:D,b:bog,b:Rh"
      }));
    });
  });
});
