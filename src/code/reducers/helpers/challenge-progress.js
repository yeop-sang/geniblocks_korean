export const scoreValues = {
  NONE: -1,
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2
};

export function setProgressScore(state, score){
  let currentProgress = state.challengeProgress.asMutable();
  let level = getChallengeName(state.mission, state.challenge,state.trial);
  currentProgress[level] = getScoreValue(score);
  return currentProgress;
}

export function updateProgress(state) {
  let currentProgress = state.challengeProgress.asMutable();
  let score = state.moves - state.goalMoves;

  let level = getChallengeName(state.mission,state.challenge,state.trial);
  currentProgress[level] = getScoreValue(score);

  return currentProgress;
}
export function getChallengeName(mission, challenge, trial){
  let challengeName = `${mission}:${challenge}:${trial}`;
  return challengeName;
}

export function getScoreValue(score){
  switch (score) {
    case 0:
      return scoreValues.GOLD;
    case 1:
      return scoreValues.SILVER;
    default:
      return score >= 2 ? scoreValues.BRONZE : scoreValues.NONE;
  }
}