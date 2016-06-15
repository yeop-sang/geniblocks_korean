import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';
import loadStateFromAuthoring from './loadStateFromAuthoring';

const initialState = Immutable({
  template: "GenomePlayground",
  drakes: [],
  hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
  trial: 1,
  moves: 0
});

export default function reducer(state, action) {
  if (!state) state = initialState;

  if (action.incrementMoves) {
    state = state.set("moves", state.moves + 1);
  }

  switch(action.type) {
    case actionTypes.LOAD_CHALLENGE_FROM_AUTHORING: {
      return loadStateFromAuthoring(state, action.authoring, action.case, action.challenge);
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
      let organismDef = state.drakes[action.index[0]][action.index[1]].alleleString,
          organismSex = state.drakes[action.index[0]][action.index[1]].sex,
          organism = new BioLogica.Organism(BioLogica.Species.Drake, organismDef, organismSex);

      organism.genetics.genotype.replaceAlleleChromName(action.chrom, action.side, action.prevAllele, action.newAllele);
      let allelePath = ["drakes", action.index[0], action.index[1], "alleleString"];

      return state.setIn(allelePath, organism.getAlleleString());
    }
    case actionTypes.SEX_CHANGED: {
      let sexPath = ["drakes", action.index[0], action.index[1], "sex"];
      return state.setIn(sexPath, action.newSex);
    }

    default:
      console.log("unknown state");
      return state;
  }
}
