import EggSortGame from '../../src/code/templates/egg-sort-game';
import GeneticsUtils from '../../src/code/utilities/genetics-utils';
import expect from 'expect';

describe('authoredDrakesToDrakeArray()', () => {
  it('Egg Game III should create valid eggs', () => {
    expect(EggSortGame.authoredDrakesToDrakeArray).toExist("must implement authoredDrakesToDrakeArray()");

    const challenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
            "template": "EggSortGame",
            "trialGenerator": {
              "type": "randomize-order",
              "baseDrake": "T-T, a-a, C-C, rh-rh, Bog-Bog",
              "drakes": [
                { "alleles": "W-W", "sex": 0 },
                { "alleles": "W-w", "sex": 0 },
                { "alleles": "w-W", "sex": 0 },
                { "alleles": "w-w", "sex": 0 },
                { "alleles": "W-W", "sex": 1 },
                { "alleles": "W-w", "sex": 1 },
                { "alleles": "w-W", "sex": 1 },
                { "alleles": "w-w", "sex": 1 }
              ]
            }
          }, ["alleles", "baseDrake"]),
          drakes = EggSortGame.authoredDrakesToDrakeArray(challenge);
    expect(drakes.length).toBe(8);
    for (let i = 0; i < drakes.length; ++i) {
      expect(GeneticsUtils.isValidAlleleString(drakes[i].alleles)).toBe(true);
    }
  });

});
