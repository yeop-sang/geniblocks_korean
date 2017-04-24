import expect from 'expect';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes,
      submittedCharacteristics = {
        armor: "Five armor",
        color:"Steel",
        forelimbs:"Forelimbs",
        health: "Healthy",
        hindlimbs: "No hindlimbs",
        horns: "Horns",
        liveliness: "Alive",
        "nose spike": "No nose spike",
        tail: "Long tail",
        wings: "Wings"
      },
      submittedAlleles = "a:T,b:T,a:M,b:M,a:W,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      acceptedAllelesCorrect = ["a:W", "b:W"],
      acceptedAllelesIncorrect = ["a:w,b:w"],
      submittedBasketLabel = "test basket";

function assertMatchingPhenotype(actionPhenotype, targetCharacteristics) {
  Object.keys(actionPhenotype).forEach((trait) => {
    expect(actionPhenotype[trait]).toEqual(targetCharacteristics[trait]);
  });
}

describe('submitEggForBasket action', () => {
  describe('when the egg is submitted correctly', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isCorrect = true;

    const dispatch = expect.createSpy();
    const getState = () => ({
      routeSpec: {level: 0, mission: 0, challenge: 0},
      drakes: [
        {
          phenotype: {characteristics: submittedCharacteristics},
          alleleString: submittedAlleles,
          sex: 0
        }
      ],
      baskets: [
        {
          alleles: acceptedAllelesCorrect,
          label: submittedBasketLabel
        }
      ],
      trials: [{}], 
      authoring: {
        challenges: {"test": {visibleGenes: "wings, arms"}}, 
        "application": {"levels": [{"missions": [{"challenges": [{"id": "test"}]}]}]}
      }
    });

    actions.submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect)(dispatch, getState);

    expect(dispatch).toHaveBeenCalled();
    it('should call dispatch with the correct _submitEggForBasket action', () => {
      var submitEggAction = dispatch.calls[0].arguments[0];
      expect(submitEggAction).toEqual({
        type: types.EGG_SUBMITTED,
        species: BioLogica.Species.Drake.name,
        submittedPhenotype: submitEggAction.submittedPhenotype, // phenotype checked below
        submittedGenotype: submittedAlleles,
        submittedSex: 0,
        acceptedGenotypes: acceptedAllelesCorrect,
        acceptedSexes: [BioLogica.FEMALE, BioLogica.MALE],
        basketLabel: submittedBasketLabel,
        visibleGenes: ["wings", "arms"],
        isCorrect,
        incrementMoves: false,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "EGG"
          }
        }
      });
      assertMatchingPhenotype(submitEggAction.submittedPhenotype, submittedCharacteristics);
    });
  });

  describe('when the egg is submitted incorrectly', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isCorrect = false;

    const dispatch = expect.createSpy();
    const getState = () => ({
      routeSpec: {level: 0, mission: 0, challenge: 0},
      drakes: [
        {
          phenotype: {characteristics: submittedCharacteristics},
          alleleString: submittedAlleles,
          sex: 0
        }
      ],
      baskets: [
        {
          alleles: acceptedAllelesIncorrect,
          label: submittedBasketLabel
        }
      ],
      trials: [{}], 
      authoring: {
        challenges: {"test": {visibleGenes: "wings, arms"}}, 
        "application": {"levels": [{"missions": [{"challenges": [{"id": "test"}]}]}]}
      }
    });

    actions.submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect)(dispatch, getState);

    expect(dispatch).toHaveBeenCalled();
    it('should call dispatch with the correct _submitEggForBasket action', () => {
      var submitEggAction = dispatch.calls[0].arguments[0];
      expect(submitEggAction).toEqual({
        type: types.EGG_SUBMITTED,
        species: BioLogica.Species.Drake.name,
        submittedPhenotype: submitEggAction.submittedPhenotype, // phenotype checked below
        submittedGenotype: submittedAlleles,
        submittedSex: 0,
        acceptedGenotypes: acceptedAllelesIncorrect,
        acceptedSexes: [BioLogica.FEMALE, BioLogica.MALE],
        basketLabel: submittedBasketLabel,
        visibleGenes: ["wings", "arms"],
        isCorrect,
        incrementMoves: true,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "EGG"
          }
        }
      });
      assertMatchingPhenotype(submitEggAction.submittedPhenotype, submittedCharacteristics);
    });
  });
});
