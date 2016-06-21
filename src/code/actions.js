export const actionTypes = {
  SESSION_STARTED: "Session started",
  LOADED_CHALLENGE_FROM_AUTHORING: "Loaded challenge from authoring",
  BRED: "Bred",
  ALLELE_CHANGED: "Allele changed",
  SEX_CHANGED: "Sex changed",
  DRAKE_SUBMITTED: "Drake submitted",
  NAVIGATED_NEXT_CHALLENGE: "Navigated to next challenge",
  MODAL_DIALOG_DISMISSED: "Modal dialog dismissed",
  ADVANCED_TRIAL: "Advanced to next trial",
  ADVANCED_CHALLENGE: "Advanced to next challenge",
  SOCKET_CONNECTED: "Socket connected",
  SOCKET_RECEIVED: "Socket received",
  SOCKET_ERRORED: "Socket errored"
};

export function startSession(uuid) {
  return {
    type: actionTypes.SESSION_STARTED,
    session: uuid
  };
}

export function loadAuthoredChallenge(_case=0, challenge=0) {
  let authoring = window.GV2Authoring;
  return {
    type: actionTypes.LOADED_CHALLENGE_FROM_AUTHORING,
    authoring,
    case: _case,
    challenge
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
      }
    }
  };
}

export function changeSex(index, newSex, incrementMoves=false) {
  return{
    type: actionTypes.SEX_CHANGED,
    index,
    newSex,
    incrementMoves
  };
}

export function submitDrake(correctPhenotype, submittedPhenotype, correct) {
  let incrementMoves = !correct;
  return{
    type: actionTypes.DRAKE_SUBMITTED,
    correctPhenotype,
    submittedPhenotype,
    correct,
    incrementMoves
  };
}

export function dismissModalDialog() {
  return{
    type: actionTypes.MODAL_DIALOG_DISMISSED
  };
}

export function advanceTrial(_case=0, challenge=1) {
  let authoring = window.GV2Authoring;
  return{
    type: actionTypes.ADVANCED_TRIAL,
    authoring,
    case: _case,
    challenge
  };
}


export function advanceChallenge(_case=0, challenge=1) {
  let authoring = window.GV2Authoring;
  return{
    type: actionTypes.ADVANCED_CHALLENGE,
    authoring,
    case: _case,
    challenge
  };
}


