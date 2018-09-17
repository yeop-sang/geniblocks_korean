import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

function assertMatchingPhenotype(actionPhenotype, targetCharacteristics) {
  Object.keys(actionPhenotype).forEach((trait) => {
    expect(actionPhenotype[trait]).toEqual(targetCharacteristics[trait]);
  });
}

const correctCharacteristics = {
        armor: "Five armor",
        color:"Steel",
        forelimbs:"Forelimbs",
        health: "Healthy",
        hindlimbs: "No hindlimbs",
        horns: "Horns",
        liveliness: "Alive",
        "nose spike": "No nose spike",
        tail: "Long tail",
        wings: "No wings",
        metallic: "Shiny",
        colored: "Colored",
        black: "Gray",
        dilute: "Deep"
      },
      correctAlleles = "a:T,b:T,a:M,b:M,a:w,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      userAlleles = "a:T,b:T,a:M,b:M,a:W,b:W,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      initialAlleles = "a:T,b:T,a:M,b:M,a:W,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      motherAlleles = "a:T,b:T,a:M,b:M,a:W,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      fatherAlleles = "a:T,b:T,a:M,b:M,a:W,b:w,a:h,b:h,a:C,b:C,a:B,b:B,a:Fl,b:Fl,a:hl,b:hl,a:A1,b:A1,a:D,a:Bog,a:rh",
      getState = () => ({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        drakes: [
          {
            alleleString: correctAlleles,
            sex: 0
          },
          {
            alleleString: userAlleles,
            sex: 0
          },
          {
            alleleString: motherAlleles,
            sex: 1
          },
          {
            alleleString: fatherAlleles,
            sex: 0
          }
        ],
        initialDrakes: [
          {},
          {
            alleleString: initialAlleles
          }
        ],
        trial: 0, trials: [{}], numTrials: 1,
        authoring: {challenges: {"test": {visibleGenes: "wings, arms"}}, "application": {"levels": [{"missions": [{"challenges": [{"id": "test"}]}]}]}}
      });


describe('submitDrake action', () => {
  describe('when the drake is submitted correctly', () => {
    const correct = true,
          dispatch = expect.createSpy();

    actions.submitDrake(0, 1, correct)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      var submitDrakeAction = dispatch.calls[0].arguments[0];
      expect(submitDrakeAction).toEqual({
        type: types.DRAKE_SUBMITTED,
        species: "Drake",
        target: {
          phenotype: submitDrakeAction.target.phenotype,  // we check valid phenotype below
          sex: 0
        },
        selected: {
          alleles: userAlleles,
          sex: 0
        },
        correct: true,
        incrementMoves: false,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "ORGANISM"
          }
        }
      });
      assertMatchingPhenotype(submitDrakeAction.target.phenotype, correctCharacteristics);
    });

    it('should call dispatch with the correct message action', () => {
      // must call thunk function ourselves
      dispatch.calls[1].arguments[0](dispatch, getState);

      // thunk function dispatches the MODAL_DIALOG_SHOWN action
      expect(dispatch).toHaveBeenCalledWith({
        arrowAsCloseButton: true,
        closeButton: {
          action: "completeChallenge"
        },
        isRaised: true,
        isInterrupt: false,
        messages: [
          {
            text: "~ALERT.COMPLETED_CHALLENGE",
            type: "narrative"
          }
        ],
        type: "Notifications shown"
      });
    });

  });

  describe('when the drake is submitted incorrectly', () => {
    const correct = false,
          dispatch = expect.createSpy();

    actions.submitDrake(0, 1, correct)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      var submitDrakeAction = dispatch.calls[0].arguments[0];
      expect(submitDrakeAction).toEqual({
        type: types.DRAKE_SUBMITTED,
        species: "Drake",
        target: {
          phenotype: submitDrakeAction.target.phenotype,  // we check valid phenotype below
          sex: 0
        },
        selected: {
          alleles: userAlleles,
          sex: 0
        },
        correct: false,
        incrementMoves: true,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "ORGANISM"
          }
        }
      });
      assertMatchingPhenotype(submitDrakeAction.target.phenotype, correctCharacteristics);
    });

    it('should call dispatch with the correct message action', () => {
      // MODAL_DIALOG_SHOWN action
      expect(dispatch.calls[1].arguments[0]).toEqual({
        type: types.NOTIFICATIONS_SHOWN,
        messages: [{
          text: "~ALERT.TITLE.INCORRECT_DRAKE"
        }],
        closeButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "dismissModalDialog"
        },
        arrowAsCloseButton: false,
        isRaised: false,
        isInterrupt: false
      });
    });

  });

  describe('when the drake is submitted as an offspring', () => {
    const correct = true,
          dispatch = expect.createSpy();

    actions.submitDrake(0, 1, correct, null, 2, 3)(dispatch, getState);

    it('should call dispatch with the correct _submitDrake action', () => {
      var submitDrakeAction = dispatch.calls[0].arguments[0];
      expect(submitDrakeAction).toEqual({
        type: types.DRAKE_SUBMITTED,
        species: "Drake",
        target: {
          phenotype: submitDrakeAction.target.phenotype,
          sex: 0
        },
        selected: {
          motherAlleles: motherAlleles,
          fatherAlleles: fatherAlleles,
          offspringAlleles: userAlleles,
          offspringSex: "male"
        },
        correct: true,
        incrementMoves: false,
        meta: {
          "itsLog": {
            "actor": "USER",
            "action": "SUBMITTED",
            "target": "OFFSPRING"
          }
        }
      });
    });

  });

  describe('the reducer', () => {
    it('should update the challengeErrors and challengeComplete property correctly when drake is incorrect', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        trial: 1,
        trials: [{}, {}],
        moves: 0,
        goalMoves: 1,
        challengeErrors: 0
      });

      let nextState = reducer(initialState, {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: false,
        incrementMoves: true
      });

      expect(nextState).toEqual(initialState.merge({
        trialSuccess: false,
        moves: 1,
        challengeErrors: 0
      }));
    });

    it('should update the currentGem and challengeComplete property correctly when drake is incorrect', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        trial: 1,
        trials: [{}, {}],
        moves: 1,
        goalMoves: 1,
        challengeErrors: 0
      });

      let nextState = reducer(initialState, {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: false,
        incrementMoves: true
      });

      expect(nextState).toEqual(initialState.merge({
        trialSuccess: false,
        moves: 2,
        challengeErrors: 1
      }));
    });

    it('should not update challengeErrors when drake is incorrect but goalMoves < 0', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0,mission: 0, challenge: 0},
        trial: 1,
        trials: [{}, {}],
        moves: 1,
        goalMoves: -1,
        challengeErrors: 0
      });

      let nextState = reducer(initialState, {
        type: types.DRAKE_SUBMITTED,
        correctPhenotype: [],
        submittedPhenotype: [],
        correct: false,
        incrementMoves: true
      });

      expect(nextState).toEqual(initialState.merge({
        trialSuccess: false,
        moves: 2,
        challengeErrors: 0
      }));
    });

    describe('when drake is correct', () => {

      describe('and there are more trials', () => {
        let defaultState = reducer(undefined, {});
        let initialState = defaultState.merge({
          routeSpec: {level: 0,mission: 0, challenge: 0},
          drakes: [
            {
              alleleString: "",
              sex: 0
            },
            {
              alleleString: "",
              sex: 0
            }
          ],
          trial: 1,
          numTrials: 3,
          gems: [],
          goalMoves: 3,
          moves: 3
        });

        const dispatch = expect.createSpy();
        actions.submitDrake(0, 1, true)(dispatch, () => initialState);

        let state1, state2, state3;


        it('should dispatch submitDrake and update the trialSuccess and challengeComplete property correctly', () => {
          let submitAction = dispatch.calls[0].arguments[0];
          expect(submitAction.type).toEqual(types.DRAKE_SUBMITTED);

          state1 = reducer(initialState, submitAction);

          expect(state1).toEqual(initialState.merge({
            trialSuccess: true,
            moves: 3,
            challengeErrors: 0,
            gems: [],
            submitted: submitAction.selected
          }));
        });

        it('should then trigger a notification_shown action', () => {
          let nextAction = dispatch.calls[1].arguments[0];
          expect(nextAction.type).toEqual(types.NOTIFICATIONS_SHOWN);

          state2 = reducer(state1, nextAction);

          expect(state2).toEqual(state1.merge({
            notifications: {
              closeButton: {
                action: "advanceTrial"
              },
              messages: [
                {
                  "text": "Good work!",
                  "type": "narrative"
                }
              ],
              arrowAsCloseButton: false,
              isRaised: false
            },
            trialSuccess: true,
            userDrakeHidden: false
          }));
        });

        it('should then trigger a modal_dialog_shown action', () => {
          let nextAction = dispatch.calls[2].arguments[0];
          expect(nextAction.type).toEqual(types.MODAL_DIALOG_SHOWN);

          state3 = reducer(state2, nextAction);

          expect(state3).toEqual(state2.merge({
            modalDialog: {
              leftButton: undefined,
              rightButton: {
                action: "advanceTrial"
              },
              bigButtonText: "~BUTTON.NEXT_TRIAL",
              show: true,
              showAward: false,
              mouseShieldOnly: false
            }
          }));
        });
      });

      describe('and there are no more trials', () => {
        let defaultState = reducer(undefined, {});
        let initialState = defaultState.merge({
          routeSpec: {level: 0,mission: 0, challenge: 0},
          drakes: [
            {
              alleleString: "",
              sex: 0
            },
            {
              alleleString: "",
              sex: 0
            }
          ],
          trial: 0,
          numTrials: 1,
          gems: [],
          goalMoves: 3,
          moves: 3,
          authoring: {challenges: {"test": {visibleGenes: "wings, arms"}}, "application": {"levels": [{"missions": [{"challenges": [{"id": "test"}]}]}]}}
        });

        let dispatch = expect.createSpy();
        let nextDispatch = expect.createSpy();
        actions.submitDrake(0, 1, true)(dispatch, () => initialState);

        let state1, state2, state3;


        it('should dispatch submitDrake and update the trialSuccess and challengeComplete property correctly', () => {
          let submitAction = dispatch.calls[0].arguments[0];
          expect(submitAction.type).toEqual(types.DRAKE_SUBMITTED);

          state1 = reducer(initialState, submitAction);

          expect(state1).toEqual(initialState.merge({
            trialSuccess: true,
            moves: 3,
            challengeErrors: 0,
            gems: [],
            submitted: submitAction.selected
          }));
        });

        it('should then trigger a complete_challenge action and award gems', () => {
          let completeChallengeThunk = dispatch.calls[1].arguments[0];
          completeChallengeThunk(nextDispatch, () => state1);
          let nextAction = nextDispatch.calls[0].arguments[0];

          state2 = reducer(state1, nextAction);

          expect(state2).toEqual(state1.merge({
            gems: state2.gems           // huge array
          }));
          expect(state2.gems[0][0][0]).toEqual([0]);
        });

        it('should then trigger an in-challenge notification about victory', () => {
          let nextAction = nextDispatch.calls[1].arguments[0];

          state3 = reducer(state2, nextAction);

          expect(state3).toEqual(state2.merge({
            notifications: {
              messages: [
                {
                  "text": "Challenge completed!",
                  "type": "narrative"
                }
              ],
              closeButton: {
                action: "completeChallenge"
              },
              arrowAsCloseButton: true,
              isRaised: true
            },
            userDrakeHidden: false
          }));
        });

      });

    });
  });
});
