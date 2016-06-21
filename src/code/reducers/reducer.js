import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';
import { loadStateFromAuthoring, loadNextTrial } from './loadStateFromAuthoring';

const initialState = Immutable({
  template: "GenomePlayground",
  drakes: [],
  hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
  trial: 1,
  moves: 0,
  showingInfoMessage: false,
  shouldShowITSMessages: false,
  userDrakeHidden: true
});

export default function reducer(state, action) {
  if (!state) state = initialState;

  if (action.incrementMoves) {
    state = state.set("moves", state.moves + 1);
  }

  switch(action.type) {
    case actionTypes.LOADED_CHALLENGE_FROM_AUTHORING: {
      state.merge({
        userDrakeHidden: true,
        showingInfoMessage: false,
        trialSuccess: false
      });

      return loadStateFromAuthoring(state, action.authoring, action.case, action.challenge);
    }
    case actionTypes.BRED: {
      let mother = new BioLogica.Organism(BioLogica.Species.Drake, action.mother, 1),
          father = new BioLogica.Organism(BioLogica.Species.Drake, action.father, 0),
          children = [];

      for (let i = 0; i < action.quantity; i++) {
        let child = BioLogica.breed(mother, father).getAlleleString();
        children.push(child);
      }

      return state.setIn(["drakes", 1], children);
    }
    case actionTypes.ALLELE_CHANGED: {
      let path = ["drakes", action.index];
      return state.updateIn(path, function(drakeDef) {
        let organism = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex);
        organism.genetics.genotype.replaceAlleleChromName(action.chromosome, action.side, action.previousAllele, action.newAllele);
        return {
          alleleString: organism.getAlleleString(),
          sex: organism.sex
        };
      });
    }
    case actionTypes.SEX_CHANGED: {
      let path = ["drakes", action.index, "sex"];
      return state.setIn(path, action.newSex);
    }
    case actionTypes.DRAKE_SUBMITTED: {
      return state.merge({
        showingInfoMessage: true,
        userDrakeHidden: false,
        trialSuccess: action.correct
      });
    }
    case actionTypes.MODAL_DIALOG_DISMISSED: {
      return state.merge({
        showingInfoMessage: false,
        userDrakeHidden: true
      });
    }
    case actionTypes.ADVANCED_TRIAL: {  
      if (state.trialSuccess){
        if (state.trial < state.trials.length) {
          return loadNextTrial(state);
        }   
        else {
          return state.merge ({ challengeComplete: true});
        }
      } else return state;
    }

    case actionTypes.ADVANCED_CHALLENGE: {  
      console.log("challenge complete");
      return state;
    }

    case actionTypes.SOCKET_RECEIVED: {
      // TODO: If you want to show dialog messages whenever you hear from the ITS...
      if (action.state.data && state.shouldShowITSMessages){
        return state.merge({
          showingInfoMessage: true,
          itsMessage: JSON.parse(action.state.data)
        });
      }
      else
        return state;
    }

    default:
      return state;
  }
}
