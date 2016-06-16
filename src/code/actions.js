export const actionTypes = {
  LOAD_CHALLENGE_FROM_AUTHORING: "LOAD_CHALLENGE_FROM_AUTHORING",
  BREED: "BREED",
  CHROMESOME_ALLELE_CHANGED: "CHROMESOME_ALLELE_CHANGED",
  SEX_CHANGED: "SEX_CHANGED",
  NAVIGATE_NEXT_CHALLENGE: "NAVIGATE_NEXT_CHALLENGE",
  SOCKET_CONNECT: "SOCKET_CONNECT",
  SOCKET_RECEIVE: "SOCKET_RECEIVE",
  SOCKET_ERROR: "SOCKET_ERROR"
};

export function loadAuthoredChallenge(_case=0, challenge=0) {
  let authoring = window.GV2Authoring;
  return {
    type: actionTypes.LOAD_CHALLENGE_FROM_AUTHORING,
    authoring,
    case: _case,
    challenge
  };
}

export function breed(mother, father, offspringBin, quantity=1, incrementMoves=false) {
  return {
    type: actionTypes.BREED,
    mother,
    father,
    offspringBin,
    quantity,
    incrementMoves
  };
}

export function chromosomeAlleleChange(index, chrom, side, prevAllele, newAllele, incrementMoves=false) {
 return {
    type: actionTypes.CHROMESOME_ALLELE_CHANGED,
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
