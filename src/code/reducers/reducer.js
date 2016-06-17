import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';
import loadStateFromAuthoring from './loadStateFromAuthoring';

const initialState = Immutable({
  template: "GenomePlayground",
  drakes: [],
  hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
  trial: 1,
  moves: 0,
  showingInfoMessage: false
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
      let path = ["drakes"].concat(action.index);
      return state.updateIn(path, function(drakeDef) {
        let organism = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex);
        organism.genetics.genotype.replaceAlleleChromName(action.chrom, action.side, action.prevAllele, action.newAllele);
        return {
          alleleString: organism.getAlleleString(),
          sex: organism.sex
        };
      });
    }
    case actionTypes.SEX_CHANGED: {
      let path = ["drakes"].concat(action.index, "sex");
      return state.setIn(path, action.newSex);
    }
    case actionTypes.SUBMIT_DRAKE: {
      return state.merge({
        showingInfoMessage: true,
        trialSuccess: action.correct
      });
    }

    case actionTypes.SOCKET_RECEIVE: {
      console.log("socket receive");
      return state;
    }

    default:
      return state;
  }
}
