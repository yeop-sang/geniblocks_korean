import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import GeneticsUtils from '../utilities/genetics-utils';
import { GAMETES_RESET } from '../modules/gametes';
import { assign } from 'lodash';

const initialState = Immutable([]);

export default function drakes(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ALLELE_CHANGED:
      return state.update(action.index, function(drakeDef) {
        let organism = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex);
        organism.genetics.genotype.replaceAlleleChromName(action.chromosome, action.side, action.previousAllele, action.newAllele);
        return assign({}, drakeDef, {alleleString: organism.getAlleleString()});
      });
    case actionTypes.SEX_CHANGED:
      return state.update(action.index, function(drakeDef) {
        let oldOrg = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex);
        let newOrg = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, action.newSex);
        let secondXAlleles, alleleString;
        if (drakeDef.sex === BioLogica.FEMALE && action.newSex === BioLogica.MALE) {
          // Store the female's extra alleles so we can later return to the same female
          secondXAlleles = GeneticsUtils.computeExtraAlleles(oldOrg, newOrg);
          alleleString = newOrg.getAlleleString();
        }
        else if (drakeDef.sex === BioLogica.MALE && action.newSex === BioLogica.FEMALE) {
          // Restore the fully specified female's alleles
          alleleString = oldOrg.getAlleleString() + "," + drakeDef.secondXAlleles;
          secondXAlleles = null;
        }
        return {
          sex: action.newSex,
          alleleString: alleleString,
          secondXAlleles: secondXAlleles
        };
      });
    case actionTypes.DRAKE_SELECTION_CHANGED:
      return state.map((drake, index) => {
        if (drake == null) return drake;
        const wasSelected = !!drake.isSelected,
              isSelected = (action.selectedIndices != null) &&
                            (action.selectedIndices.indexOf(index) >= 0);
        let newDrake = drake;
        if (isSelected !== wasSelected) {
          newDrake = drake.asMutable();
          newDrake.isSelected = isSelected;
        }
        return newDrake;
      });
    case GAMETES_RESET:
      return state.set(2, null);
    case actionTypes.OFFSPRING_KEPT:
      if (action.success) {
        state = state.concat({
          alleleString: state[action.index].alleleString,
          sex: state[action.index].sex
        });
        if (!action.keepDisplayBaby) {
          state = state.set(action.index, null);
        }
      }
      return state;
    case actionTypes.EGG_ACCEPTED:
      return state.setIn([action.eggDrakeIndex, "basket"], action.basketIndex);
    case actionTypes.EGG_REJECTED:
      return state.setIn([action.eggDrakeIndex, "basket"], -1);
    default:
      return state;
  }
}
