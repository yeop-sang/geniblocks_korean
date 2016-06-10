import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';

const initialState = Immutable({
  drakes: [],
  hiddenAlleles: ""
});

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case actionTypes.INITIALIZE_STATE_FROM_AUTHORING: {
      let parents  = [],
          children = [];

      parents.push("a:T,b:T,a:m,b:M,a:W,b:W,a:H,b:h,a:C,b:C,a:b,b:B,a:Fl,b:fl,a:Hl,b:Hl,a:A1,b:A2,a:D,b:dl,a:bog,b:bog,a:rh,b:Rh");
      parents.push("a:Tk,b:T,a:M,b:M,a:w,b:w,a:H,b:H,a:C,b:C,a:b,b:b,a:Fl,b:Fl,a:hl,b:Hl,a:A2,b:a,a:D,a:Bog,a:rh");

      return state.set("drakes", [parents, children]);
    }
    case actionTypes.BREED: {
      let mother = new BioLogica.Organism(BioLogica.Species.Drake, action.mother, 1),
          father = new BioLogica.Organism(BioLogica.Species.Drake, action.father, 0),
          children = [];

      for (let i = 0; i < action.quantity; i++) {
        let child = BioLogica.breed(mother, father).getAlleleString();
        children.push(child);
      }

      return state.setIn(["drakes", 1], children);
    }
    case actionTypes.CHROMESOME_ALLELE_CHANGED: {
      let organismDef = state.drakes[action.index[0]][action.index[1]],
          organism = new BioLogica.Organism(BioLogica.Species.Drake, organismDef, 1);

      organism.genetics.genotype.replaceAlleleChromName(action.chrom, action.side, action.prevAllele, action.newAllele);

      // state.setIn(["drakes", 0, 0], "a:h,b:h");
      return state.setIn(["drakes"].concat(action.index), organism.getAlleleString());
    }

    default:
      return state;
  }
}
