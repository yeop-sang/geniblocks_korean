import expect from 'expect';
import reducer from '../../src/code/reducers/reducer';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('changeAllele action', () => {
  it('should create the correct action when an allele is changed', () => {
    const index = 1,
          chromosome = "X",
          side = "a",
          previousAllele = "m",
          newAllele = "M";

    let actionObject = actions.changeAllele(index, chromosome, side, previousAllele, newAllele);

    expect(actionObject).toEqual({
      type: types.ALLELE_CHANGED,
      index,
      chromosome,
      side,
      previousAllele,
      newAllele,
      incrementMoves: false,
      meta: {
        logNextState: {
          newAlleles: ["drakes", 1, "alleleString"]
        }
      }
    });
  });

  describe('the reducer', () => {
    it('should update the drakes alleles when passed an ALLELE_CHANGED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes",
        [{
          alleleString: "a:T,b:T,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
          sex: 0
        }]);

      let nextState = reducer(initialState, {
        type: types.ALLELE_CHANGED,
        index: 0,
        chromosome: "1",
        side: "a",
        previousAllele: "T",
        newAllele: "t",
        incrementMoves: false
      });

      expect(nextState).toEqual(initialState.setIn(["drakes", 0], {
        alleleString: 'a:t,b:T,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh',
        sex: 0
      }));
    });

    it('should update the correct drake when there are multiple drakes available', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes",
        [{
          alleleString: "a:T,b:T,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
          sex: 0
        },
        {
          alleleString: "a:t,b:t,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
          sex: 0
        },
        {
          alleleString: "a:T,b:T,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
          sex: 0
        }]);

      let nextState = reducer(initialState, {
        type: types.ALLELE_CHANGED,
        index: 1,
        chromosome: "1",
        side: "b",
        previousAllele: "t",
        newAllele: "T",
        incrementMoves: false
      });

      expect(nextState).toEqual(initialState.setIn(["drakes", 1], {
        alleleString: 'a:t,b:T,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh',
        sex: 0
      }));
    });
  });
});
