import expect from 'expect';
import Immutable from 'seamless-immutable';
import GeneticsUtils from '../../src/code/utilities/genetics-utils';
import { loadStateFromAuthoring } from '../../src/code/reducers/helpers/load-state-from-authoring';

describe("Loading an authored challenge", function() {
  let initialState = Immutable({
    routeSpec: {
      level: 0,
      mission: 0,
      challenge: 0
    }
  });
  let authoredStateWrapper = Immutable({
    "application" : {
      "levels" : [ {
        "missions" : [ {
          "challenges" : [ {
            "id" : "test",
            "room" : "simroom"
          } ]
        } ]
      }]
    }
  });

  describe("in the clutch game", function() {
    describe("when we have one trial", function() {
      let authoredChallenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
        "test": {
          "template": "ClutchGame",
          "mother": [{
            "alleles": "W-W",
            "sex": 1
          }],
          "father": [{
            "alleles": "w-w",
            "sex": 0
          }],
          "targetDrakes": [{
            "alleles": "W-w",
            "sex": 0
          }],
          "goalMoves": [1]
        }
      }, "alleles");
      let authoring = authoredStateWrapper.set("challenges", authoredChallenge);

      let state = loadStateFromAuthoring(initialState, authoring);

      it("should load the drakes as authored", function() {
          expect(GeneticsUtils.isValidAlleleString(state.drakes[0].alleleString)).toBe(true);
          expect(state.drakes[0].alleleString.indexOf("a:W,b:W") > -1).toBe(true);

          expect(GeneticsUtils.isValidAlleleString(state.drakes[1].alleleString)).toBe(true);
          expect(state.drakes[1].alleleString.indexOf("a:w,b:w") > -1).toBe(true);

          expect(GeneticsUtils.isValidAlleleString(state.drakes[2].alleleString)).toBe(true);
          expect(state.drakes[2].alleleString.indexOf("a:W,b:w") > -1).toBe(true);

          expect(state.goalMoves).toBe(1);
      });
    });

    describe("when we have multiple trials", function() {
      let authoredChallenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
        "test": {
          "template": "ClutchGame",
          "mother": [{
            "alleles": "W-W",
            "sex": 1
          }, {
            "alleles": "W-w",
            "sex": 1
          }],
          "father": [{
            "alleles": "w-w",
            "sex": 0
          }, {
            "alleles": "w-W",
            "sex": 0
          }],
          "targetDrakes": [{
            "alleles": "W-w",
            "sex": 0
          }, {
            "alleles": "w-w",
            "sex": 0
          }],
          "goalMoves": [2, 3]
        }
      }, "alleles");
      let authoring = authoredStateWrapper.set("challenges", authoredChallenge);
      let trialOneState = initialState.merge({"trial": 1, "trialOrder": [0, 1]});
      let state = loadStateFromAuthoring(trialOneState, authoring);

      it("should load the drakes as authored", function() {
          expect(state.drakes[0].alleleString.indexOf("a:W,b:w") > -1).toBe(true);
          expect(state.drakes[1].alleleString.indexOf("a:w,b:W") > -1).toBe(true);
          expect(state.drakes[2].alleleString.indexOf("a:w,b:w") > -1).toBe(true);
          expect(state.goalMoves).toBe(3);
      });
    });

    describe("when we have random matched selection", function() {
      let authoredChallenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
        "test": {
          "template": "ClutchGame",
          "mother": [ {
            "randomMatched": [{
              "alleles": "W-W",
              "sex": 1
            }, {
              "alleles": "w-w",
              "sex": 1
            }]
          } ],
          "father": [ {
            "randomMatched": [{
              "alleles": "W-w",
              "sex": 1
            }, {
              "alleles": "w-W",
              "sex": 1
            }]
          } ],
          "targetDrakes": [ {
            "randomMatched": [{
              "alleles": "w-w",
              "sex": 1
            }, {
              "alleles": "W-W",
              "sex": 1
            }]
          } ],
          "goalMoves": [[4, 5]]
        }
      }, "alleles");
      let authoring = authoredStateWrapper.set("challenges", authoredChallenge);
      let state = loadStateFromAuthoring(initialState, authoring);

      it("should load the drakes with one of the random variations for the trial", function() {
          let mother = state.drakes[0].alleleString;
          let father = state.drakes[1].alleleString;
          let target = state.drakes[2].alleleString;
          let goal = state.goalMoves;
          let variation1 = (mother.indexOf("a:W,b:W") > -1) && (father.indexOf("a:W,b:w") > -1) && (target.indexOf("a:w,b:w") > -1 && goal === 4);
          let variation2 = (mother.indexOf("a:w,b:w") > -1) && (father.indexOf("a:w,b:W") > -1) && (target.indexOf("a:W,b:W") > -1 && goal === 5);

          expect(variation1 || variation2).toBe(true);
      });
    });
  });
});