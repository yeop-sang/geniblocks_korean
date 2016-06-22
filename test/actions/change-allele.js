import expect from 'expect';
import reducer from '../../src/code/reducers/reducer';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('changeAllele', () => {
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

  it('should update the drakes alleles when passed an ALLELE_CHANGED action', () => {
    let defaultState = reducer(undefined, {});
    let initialState = defaultState.set("drakes",
      [{
        alleleString: "a:T,b:T,a:m,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
        sex: 0
      }]);

    let nextState = reducer(initialState, {
      type: types.ALLELE_CHANGED,
      index: 0,
      chromosome: "1",
      side: "a",
      previousAllele: "T",
      newAllele: "t",
      incrementMoves: true
    });

    expect(nextState.drakes[0]).toEqual({
      alleleString: 'a:t,b:T,a:m,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:Hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh',
      sex: 0
    });
  });
});
