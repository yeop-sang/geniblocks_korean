import { generateTrialDrakes } from '../../src/code/utilities/trial-generator';
import GeneticsUtils from '../../src/code/utilities/genetics-utils';
import expect from 'expect';

describe('generateTrialDrakes() -- all-combinations', () => {
  it('Trial Generator: all-combinations should generate valid drakes', () => {
    const spec = GeneticsUtils.convertDashAllelesObjectToABAlleles({
                  "type": "all-combinations",
                  "baseDrake": "T-T, h-h, A1-A1, C-C, B-B, D-D, rh-rh, Bog-Bog",
                  "initialDrakeCombos": [
                    ["M-M",   "M-m",   "m-M",   "m-m"],
                    ["W-W",   "W-w",   "w-W",   "w-w"],
                    ["Fl-Fl", "Fl-fl", "fl-Fl", "fl-fl"],
                    ["Hl-Hl", "Hl-hl", "hl-Hl", "hl-hl"]
                  ],
                  "targetDrakeCombos": [
                    ["M-M",   "m-m"],
                    ["W-W",   "w-w"],
                    ["Fl-Fl", "fl-fl"],
                    ["Hl-Hl", "hl-hl"]
                  ]
                }, ["baseDrake", "initialDrakeCombos", "targetDrakeCombos"]);
    for (let trial = 0; trial < 16; ++trial) {
      let drakes = generateTrialDrakes(spec, trial);
      expect(drakes.length).toBe(2);
      expect(GeneticsUtils.isValidAlleleString(drakes[0].alleles)).toBe(true);
      expect(GeneticsUtils.isValidAlleleString(drakes[1].alleles)).toBe(true);
    }
  });
});

describe('generateTrialDrakes() -- randomize-order', () => {
  it('Trial Generator: randomize-order should just randomize the order', () => {
    const spec = GeneticsUtils.convertDashAllelesObjectToABAlleles({
                  "type": "randomize-order",
                  "baseDrake": "T-T, a-a, C-C, rh-rh, Bog-Bog",
                  "drakes": [
                    { "index": 0, "alleles": "W-W", "sex": 0 },
                    { "index": 1, "alleles": "W-w", "sex": 0 },
                    { "index": 2, "alleles": "w-W", "sex": 0 },
                    { "index": 3, "alleles": "w-w", "sex": 0 },
                    { "index": 4, "alleles": "W-W", "sex": 1 },
                    { "index": 5, "alleles": "W-w", "sex": 1 },
                    { "index": 6, "alleles": "w-W", "sex": 1 },
                    { "index": 7, "alleles": "w-w", "sex": 1 },
                    { "index": 8, "alleles": "W-W", "sex": 0 },
                    { "index": 9, "alleles": "W-w", "sex": 0 },
                    { "index": 10, "alleles": "w-W", "sex": 0 },
                    { "index": 11, "alleles": "w-w", "sex": 0 },
                    { "index": 12, "alleles": "W-W", "sex": 1 },
                    { "index": 13, "alleles": "W-w", "sex": 1 },
                    { "index": 14, "alleles": "w-W", "sex": 1 },
                    { "index": 15, "alleles": "w-w", "sex": 1 }
                  ]
                }, ["alleles", "baseDrake"]),
          drakes = generateTrialDrakes(spec);
    expect(drakes.length).toBe(16);
    for (let i = 0; i < drakes.length; ++i) {
      expect(GeneticsUtils.isValidAlleleString(drakes[i].alleles)).toBe(true);
    }
    let counts = drakes.reduce((prev) => {
      prev.push(0);
      return prev;
    }, []);
    drakes.forEach((drake) => {
      ++ counts[drake.index];
    });
    const isComplete = drakes.every((drake) => {
      return (counts[drake.index] === 1);
    });
    expect(isComplete).toBe(true);
    const isStillInOrder = drakes.every((drake, index) => {
      return (index === drake.index);
    });
    expect(isStillInOrder).toBe(false);
  });
});
