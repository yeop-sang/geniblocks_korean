export const scoreValues = {
  NONE: -1,
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2
};

export function setProgressScore(state, score){
  let currentProgress = state.challengeProgress.asMutable();
  let level = getChallengeName(state.case, state.challenge,state.trial);
  currentProgress[level] = getScoreValue(score);
  return currentProgress;
}

export function updateProgress(state, correct) {
  let currentProgress = state.challengeProgress.asMutable();
  let score = -1;
  if (correct){
    score = state.moves - state.goalMoves;
  } 

  let level = getChallengeName(state.case,state.challenge,state.trial);
  currentProgress[level] = getScoreValue(score);

  return currentProgress;
}
export function getChallengeName(case_, challenge, trial){
  let challengeName = `${case_}:${challenge}:${trial}`;
  return challengeName;
}

export function getScoreValue(score){
  let scoreValue = scoreValues.NONE;

  switch (score) {
    case 0:
      scoreValue = scoreValues.GOLD;
      break;
    case 1:
      scoreValue = scoreValues.SILVER;
      break;
    case 2:
      scoreValue = scoreValues.BRONZE;
      break;
    default:
      scoreValue = scoreValues.NONE;
  }
  return scoreValue;
}