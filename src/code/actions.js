export const actionTypes = {
  SESSION_STARTED: "Session started",
  LOADED_CHALLENGE_FROM_AUTHORING: "Loaded challenge from authoring",
  NAVIGATED: "Navigated",
  PLAYGROUND_COMPLETE: "Playground completed",
  BRED: "Bred",
  ALLELE_CHANGED: "Allele changed",
  SEX_CHANGED: "Sex changed",
  GAMETE_CHROMOSOME_ADDED: "Gamete chromosome added",
  FERTILIZED: "Fertilized",
  OFFSPRING_KEPT: "Offspring kept",
  DRAKE_SUBMITTED: "Drake submitted",
  GAMETES_RESET: "Gametes reset",
  NAVIGATED_NEXT_CHALLENGE: "Navigated to next challenge",
  MODAL_DIALOG_SHOWN: "Modal dialog shown",
  MODAL_DIALOG_DISMISSED: "Modal dialog dismissed",
  ADVANCED_TRIAL: "Advanced to next trial",
  ADVANCED_CHALLENGE: "Advanced to next challenge",
  ADD_TRANSIENT_STATE: "Add transient state",
  REMOVE_TRANSIENT_STATE: "Remove transient state",
  SOCKET_CONNECTED: "Socket connected",
  SOCKET_RECEIVED: "Socket received",
  SOCKET_ERRORED: "Socket errored"
};

const ITS_ACTORS = {
  SYSTEM: "SYSTEM",
  USER: "USER"
};

const ITS_ACTIONS = {
  STARTED: "STARTED",
  NAVIGATED: "NAVIGATED",
  ADVANCED: "ADVANCED",
  CHANGED: "CHANGED",
  SUBMITTED: "SUBMITTED"
};

const ITS_TARGETS = {
  SESSION: "SESSION",
  CHALLENGE: "CHALLENGE",
  TRIAL: "TRIAL",
  ALLELE: "ALLELE",
  SEX: "SEX",
  DRAKE: "DRAKE"
};

export const transientStateTypes = {
  FERTILIZING: "Fertilizing",
  HATCHING: "Hatching"
};

export function startSession(uuid) {
  return {
    type: actionTypes.SESSION_STARTED,
    session: uuid,
    meta: {
      dontLog: ["session"],
      itsLog: {
        actor: ITS_ACTORS.SYSTEM,
        action: ITS_ACTIONS.STARTED,
        target: ITS_TARGETS.SESSION
      }
    }
  };
}

export function navigateToChallenge(_case, challenge) {
  return {
    type: actionTypes.NAVIGATED,
    case: _case,
    challenge,
    route: `/${_case+1}/${challenge+1}`,
    meta: {
      logTemplateState: true,
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.NAVIGATED,
        target: ITS_TARGETS.CHALLENGE
      }
    }
  };
}

export function navigateToNextChallenge() {
  return (dispatch, getState) => {
    const { case: currentCase, challenge: currentChallenge, authoring} = getState();
    let nextCase = currentCase,
        nextChallenge = currentChallenge+1;
    if (authoring[currentCase].length <= nextChallenge) {
      if (authoring[currentCase+1]) nextCase++;
      nextChallenge = 0;
    }
    dispatch(navigateToChallenge(nextCase, nextChallenge));
  };
}

/*
 * Called when route params are different from current case and challenge,
 * so user must have changed them in the address bar.
 * Skips the route change, so just updates current case and challenge and
 * triggers `loadStateFromAuthoring` in router
 */
export function navigateToCurrentRoute(_case, challenge) {
  return {
    type: actionTypes.NAVIGATED,
    case: _case,
    challenge,
    skipRouteChange: true,
    meta: {
      logTemplateState: true,
      dontLog: ["skipRouteChange"],
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.NAVIGATED,
        target: ITS_TARGETS.CHALLENGE
      }
    }
  };
}

export function breed(mother, father, offspringBin, quantity=1, incrementMoves=false) {
  return {
    type: actionTypes.BRED,
    mother,
    father,
    offspringBin,
    quantity,
    incrementMoves
  };
}

export function changeAllele(index, chromosome, side, previousAllele, newAllele, incrementMoves=false) {
 return {
    type: actionTypes.ALLELE_CHANGED,
    index,
    chromosome,
    side,
    previousAllele,
    newAllele,
    incrementMoves,
    meta: {
      logNextState: {
        newAlleles: ["drakes", index, "alleleString"]
      },
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.CHANGED,
        target: ITS_TARGETS.ALLELE
      }
    }
  };
}

export function changeSex(index, newSex, incrementMoves=false) {
  return{
    type: actionTypes.SEX_CHANGED,
    index,
    newSex,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.CHANGED,
        target: ITS_TARGETS.SEX
      }
    }
  };
}

export function _submitDrake(correctPhenotype, submittedPhenotype, correct) {
  let incrementMoves = !correct;
  return{
    type: actionTypes.DRAKE_SUBMITTED,
    correctPhenotype,
    submittedPhenotype,
    correct,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.SUBMITTED,
        target: ITS_TARGETS.DRAKE
      }
    }
  };
}

export function submitDrake(correctPhenotype, submittedPhenotype, correct) {
  return (dispatch, getState) => {
    dispatch(_submitDrake(correctPhenotype, submittedPhenotype, correct));

    const state = getState();
    let challengeComplete = false,
        caseComplete = false;

    if (correct && state.trial === state.trials.length-1) {
      challengeComplete = true;
      if (state.authoring[state.case].length <= state.challenge+1) {
        caseComplete = true;
      }
    }

    let dialog = {};

    if (correct) {
      if (caseComplete) {
        dialog = {
          message: "Good work!",
          explanation: "You have found all the pieces of this coin!",
          rightButton: {
            label: "Next case",
            action: "navigateToNextChallenge"
          },
          showAward: true
        };
      } else if (challengeComplete) {
        dialog = {
          message: "Good work!",
          explanation: "You earned a piece of a coin!",
          rightButton: {
            label: "Next challenge",
            action: "navigateToNextChallenge"
          },
          showAward: true
        };
      } else {
        dialog = {
          message: "Good work!",
          explanation: "The drake you have created matches the target drake.",
          rightButton:{
            label: "Next trial",
            action: "advanceTrial"
          },
          top: "475px"
        };
      }
    } else {
      dialog = {
        message: "That's not the drake!",
        explanation: "The drake you have created doesn't match the target drake.\nPlease try again.",
        rightButton: {
          label: "Try again",
          action: "dismissModalDialog"
        },
        top: "475px"
      };
    }
    dispatch(showModalDialog(dialog));
  };
}

export function showModalDialog({message, explanation, rightButton, leftButton, showAward=false, top}) {
  return{
    type: actionTypes.MODAL_DIALOG_SHOWN,
    message,
    explanation,
    rightButton,
    leftButton,
    showAward,
    top
  };
}

export function dismissModalDialog() {
  return{
    type: actionTypes.MODAL_DIALOG_DISMISSED
  };
}

export function advanceTrial() {
  let authoring = window.GV2Authoring;
  return{
    type: actionTypes.ADVANCED_TRIAL,
    authoring,
    meta: {
      logTemplateState: true,
      dontLog: ["authoring"],
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.ADVANCED,
        target: ITS_TARGETS.TRIAL
      }
    }
  };
}


export function advanceChallenge() {
  let authoring = window.GV2Authoring;
  return{
    type: actionTypes.ADVANCED_CHALLENGE,
    authoring,
    meta: {
      logTemplateState: true,
      dontLog: ["authoring"],
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.ADVANCED,
        target: ITS_TARGETS.CHALLENGE
      }
    }
  };
}

export function playgroundComplete() {
  return (dispatch) => {
    dispatch({
      type:actionTypes.PLAYGROUND_COMPLETE
    });
    dispatch(showModalDialog({
      message: "Good work!",
      explanation: "You earned a piece of a coin!",
      rightButton:{
        label: "Next challenge",
        action: "navigateToNextChallenge"
      },
      showAward: true
    }));
  };
}

export function addGameteChromosome(index, name, side) {
  return{
    type: actionTypes.GAMETE_CHROMOSOME_ADDED,
    index,
    name,
    side
  };
}

export function fertilize(gamete1, gamete2) {
  return {
    type: actionTypes.FERTILIZED,
    gamete1,
    gamete2
  };
}

export function initiateDelayedFertilization(delay, gamete1, gamete2) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.ADD_TRANSIENT_STATE,
      transientState: transientStateTypes.FERTILIZING
    });
    setTimeout( () => {
      dispatch({
        type: actionTypes.REMOVE_TRANSIENT_STATE,
        transientState: transientStateTypes.FERTILIZING
      });
      dispatch({
        type: actionTypes.ADD_TRANSIENT_STATE,
        transientState: transientStateTypes.HATCHING
      });
      setTimeout( () => {
        dispatch({
          type: actionTypes.REMOVE_TRANSIENT_STATE,
          transientState: transientStateTypes.HATCHING
        });
        dispatch(fertilize(gamete1, gamete2));
      }, 3000);
    }, delay);
  };
}

export function keepOffspring() {
  return {
    type: actionTypes.OFFSPRING_KEPT
  };
}

export function resetGametes() {
  return {
    type: actionTypes.GAMETES_RESET
  };
}
