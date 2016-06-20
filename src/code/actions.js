export const actionTypes = {
  LOADED_CHALLENGE_FROM_AUTHORING: "LOADED_CHALLENGE_FROM_AUTHORING",
  BRED: "BRED",
  ALLELE_CHANGED: "ALLELE_CHANGED",
  SEX_CHANGED: "SEX_CHANGED",
  DRAKE_SUBMITTED: "DRAKE_SUBMITTED",
  NAVIGATED_NEXT_CHALLENGE: "NAVIGATED_NEXT_CHALLENGE",
  MODAL_DIALOG_DISMISSED: "MODAL_DIALOG_DISMISSED",
  SOCKET_CONNECTED: "SOCKET_CONNECTED",
  SOCKET_RECEIVED: "SOCKET_RECEIVED",
  SOCKET_ERRORED: "SOCKET_ERRORED"
};

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

export function chromosomeAlleleChange(index, chrom, side, prevAllele, newAllele, incrementMoves=false) {
 return {
    type: actionTypes.ALLELE_CHANGED,
    index,
    chrom,
    side,
    prevAllele,
    newAllele,
    incrementMoves
  };
}

export function sexChange(index, newSex, incrementMoves=false) {
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


