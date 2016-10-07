import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';

const initialState = Immutable([]);

export default function drakes(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ALLELE_CHANGED:
      return state.update(action.index, function(drakeDef) {
        let organism = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex);
        organism.genetics.genotype.replaceAlleleChromName(action.chromosome, action.side, action.previousAllele, action.newAllele);
        return {
          alleleString: organism.getAlleleString(),
          sex: organism.sex
        };
      });
    case actionTypes.SEX_CHANGED:
      return state.setIn([action.index, "sex"], action.newSex);
    case actionTypes.GAMETES_RESET:
      return state.set(2, null);
    case actionTypes.OFFSPRING_KEPT:
      if (action.success) {
        state = state.concat({
          alleleString: state[action.index].alleleString,
          sex: state[action.index].sex
        });
        state = state.set(action.index, null);
      }
      return state;
    case actionTypes.EGG_ACCEPTED:
      return state.setIn([action.eggIndex + 3, "basket"], action.basketIndex);
    default:
      return state;
  }
}
