export const scoreValues = {
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2
};

export function updateProgress(state) {
  let currentProgress = state.challengeProgress.asMutable();
  let score = state.moves - state.goalMoves;
  let scoreValue = scoreValues.BRONZE;

  switch (score) {
    case 0:
      scoreValue = scoreValues.GOLD;
      break;
    case 1:
      scoreValue = scoreValues.SILVER;
      break;
    default:
      scoreValue = scoreValues.BRONZE;
      break;
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
    challengeAwardProgress.push(progress[challengeProgressName]);
  }
  
  return challengeAwardProgress;
}