import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import GeneticsUtils from '../utilities/genetics-utils';
import { GAMETES_RESET, motherCurrentGamete, fatherCurrentGamete } from '../modules/gametes';
import { assign } from 'lodash';

const initialState = Immutable([]);


function fertilize(state, gametes) {
  let chromosomes0 = new BioLogica.Organism(BioLogica.Species.Drake, state[0].alleleString, state[0].sex).getGenotype().chromosomes,
      chromosomes1 = new BioLogica.Organism(BioLogica.Species.Drake, state[1].alleleString, state[1].sex).getGenotype().chromosomes,
      alleleString = "",
      sex = 1,
      side, chromosome, name;
  for (name in chromosomes0) {
    side = motherCurrentGamete(gametes)[name];
    chromosome = chromosomes0[name][side];
    if (chromosome && chromosome.alleles) alleleString += "a:" + chromosome.alleles.join(",a:") + ",";
  }
  for (name in chromosomes1) {
    side = fatherCurrentGamete(gametes)[name];
    if (side === "y") sex = 0;
    chromosome = chromosomes1[name][side];
    if (chromosome && chromosome.alleles && chromosome.alleles.length) alleleString += "b:" + chromosome.alleles.join(",b:") + ",";
  }

  return state.setIn([2], {
    alleleString,
    sex
  });
}

function breedClutch(state, clutchSize) {
  let mother = new BioLogica.Organism(BioLogica.Species.Drake, state[0].alleleString, state[0].sex),
      father = new BioLogica.Organism(BioLogica.Species.Drake, state[1].alleleString, state[1].sex);

  for (let i = 0; i < clutchSize; i++) {
    let clutchDrake = BioLogica.breed(mother, father, true);
    state = state.concat({
      alleleString: clutchDrake.getAlleleString(),
      sex: clutchDrake.sex
    });
  }
  return state;
}

function clearClutch(state, index) {
  if (index && index > -1) {
    let nextDrakes = [];
    for (let i = 0; i < index; i++){
      nextDrakes.push(state[i]);
    }
    return nextDrakes;
  }
  return state;
}

export default function drakes(state = initialState, gametes = {}, action) {
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
          if (drakeDef.secondXAlleles) {
            // Restore the fully specified female's alleles
            alleleString = oldOrg.getAlleleString() + "," + drakeDef.secondXAlleles;
          }
          else {
            // Use the male's partial allele string; the remainder will be randomized
            alleleString = oldOrg.getAlleleString();
          }

          secondXAlleles = null;
        }
        return assign({}, secondXAlleles ? {secondXAlleles: secondXAlleles} : null, {
          sex: action.newSex,
          alleleString: alleleString,
        });
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
        if (!action.shouldKeepSourceDrake) {
          state = state.set(action.index, null);
        }
      }
      return state;
    case actionTypes.EGG_ACCEPTED:
      return state.setIn([action.eggDrakeIndex, "basket"], action.basketIndex);
    case actionTypes.EGG_REJECTED:
      return state.setIn([action.eggDrakeIndex, "basket"], -1);
    case actionTypes.FERTILIZED:
      return fertilize(state, gametes);
    case actionTypes.CLUTCH_BRED:
      return breedClutch(state, action.clutchSize);
    case actionTypes.CLUTCH_CLEARED:
      return clearClutch(state, action.index);
    default:
      return state;
  }
}
