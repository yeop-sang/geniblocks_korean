import EggGame from '../../src/code/templates/egg-game';
import GeneticsUtils from '../../src/code/utilities/genetics-utils';
import expect from 'expect';

describe('authoredDrakesToDrakeArray()', () => {
  it('Egg Game I should create valid parent drakes', () => {
    expect(EggGame.authoredDrakesToDrakeArray).toExist("must implement authoredDrakesToDrakeArray()");

    const challenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
            "challengeType": "create-unique",
            "mother":{
              "alleles": "w-W, M-m, fl-, hl-, T-T, h-h, C-C, A1-A1, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 1
            },
            "father": {
              "alleles": "w-W, m-m, T-T, h-h, A1-A1, C-C, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 0
            }
          }, ["alleles"]),
          drakes = EggGame.authoredDrakesToDrakeArray(challenge);
    expect(drakes.length).toBe(2);
    expect(GeneticsUtils.isValidAlleleString(drakes[0].alleles)).toBe(true);
    expect(GeneticsUtils.isValidAlleleString(drakes[1].alleles)).toBe(true);
  });

  it('Egg Game II should create complete parent and target drakes', () => {
    expect(EggGame.authoredDrakesToDrakeArray).toExist("must implement authoredDrakesToDrakeArray()");

    const challenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
            "challengeType": "match-target",
            "mother":{
              "alleles": "w-W, M-m, fl-, hl-, T-T, h-h, C-C, A1-A1, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 1
            },
            "father": {
              "alleles": "w-W, m-m, T-T, h-h, A1-A1, C-C, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 0
            },
            "targetDrakes": [{},{},{}]
          }, ["alleles"]),
          drakes = EggGame.authoredDrakesToDrakeArray(challenge),
          targetDrakeCount = challenge.targetDrakes.length;
    expect(drakes).toExist("must return authored drakes array");
    expect(drakes.length).toBeGreaterThanOrEqualTo(2 + targetDrakeCount);
    expect(GeneticsUtils.isCompleteAlleleString(drakes[0].alleles)).toBe(true);
    expect(GeneticsUtils.isCompleteAlleleString(drakes[1].alleles)).toBe(true);
    for (let i = 0; i < targetDrakeCount; ++i) {
      const index = drakes.length - targetDrakeCount + i;
      expect(GeneticsUtils.isCompleteAlleleString(drakes[index].alleles)).toBe(true);
    }
  });
});
