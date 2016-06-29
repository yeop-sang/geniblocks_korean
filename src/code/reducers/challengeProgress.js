export const scoreValues = {
  NONE: -1,
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2
};

export function updateProgress(state, correct) {
  let currentProgress = state.challengeProgress.asMutable();
  let score = -1;
  if (correct){
    score = state.moves - state.goalMoves;
  } 
  
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
  let level = getChallengeName(state.case,state.challenge,state.trial);
  currentProgress[level] = scoreValue;

  return currentProgress;
}
export function getChallengeName(case_, challenge, trial){
  let challengeName = `${case_}:${challenge}:${trial}`;
  return challengeName;
}
export function getChallengeScore(case_, challenge, trialCount, progress) {
  let challengeAwardProgress = [];
  for (let i = 0; i < trialCount; i++){
    let challengeProgressName = getChallengeName(case_, challenge, i);
    let score = progress[challengeProgressName];
    if (score != null) {
      challengeAwardProgress.push(score);
    } else {
      challengeAwardProgress.push(-1);
    }
  }
  
  return challengeAwardProgress;
}