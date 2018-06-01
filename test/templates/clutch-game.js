import ClutchGame from '../../src/code/templates/clutch-game';
import GeneticsUtils from '../../src/code/utilities/genetics-utils';
// import reducer from '../../src/code/reducers/';
// import { navigateToChallenge } from '../../src/code/actions';
import expect from 'expect';


// const basicUnderdefinedInitialState = (template, routeSpec, challenges) => ({
//   template,
//   routeSpec,
//   challenges,
//   showUserDrake: false,
//   trialSuccess: false,
//   numTargets: 1,
//   location: {
//     "id": "simroom"
//   },
//   showingRoom: true
// });

const testCrossChallenge = {
  "challengeType": "test-cross",
  "mother": [ {
    "alleles" : "H-H, w-w, b-b, M-M, A1-A1, fl-fl, hl-Hl, T-T, C-C, D-D, rh-rh, Bog-Bog",
    "sex" : 1
  }],
  "father" : [ {
    "alleles" : "A1-A1, W-w, B-B, H-h, m-m, fl-fl, D-D, Hl-hl, C-C",
    "sex" : 0
  }],
  hiddenParent: {
    "hiddenGenotype": true,
    "hiddenImage": false,
    "sex": 0
  }
};

describe('authoredDrakesToDrakeArray()', () => {
  it('Test cross should create valid parent drakes', () => {
    expect(ClutchGame.authoredDrakesToDrakeArray).toExist("must implement authoredDrakesToDrakeArray()");

    const challenge = GeneticsUtils.convertDashAllelesObjectToABAlleles(testCrossChallenge, "alleles"),
      drakes = ClutchGame.authoredDrakesToDrakeArray(challenge);

    expect(drakes.length).toBe(2);
    expect(GeneticsUtils.isValidAlleleString(drakes[0].alleles)).toBe(true);
    expect(GeneticsUtils.isValidAlleleString(drakes[1].alleles)).toBe(true);
  });
});

describe('getHiddenParents()', () => {
  it('Test cross should load hidden parent definition', () => {
    expect(ClutchGame.getHiddenParent).toExist("must implement getHiddenParent()");
    expect(ClutchGame.getHiddenParent(testCrossChallenge) !== null).toBe(true);
  });
});