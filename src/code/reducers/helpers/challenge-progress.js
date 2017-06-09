export const scoreValues = {
  NONE: -1,
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2
};

export function setProgressScore(state, score){
  let currentProgress = state.challengeProgress.asMutable();
  let level = getChallengeName(state.routeSpec,state.trial);
  currentProgress[level] = getScoreValue(score);
  return currentProgress;
}

export function updateProgress(state) {
  let currentProgress = state.challengeProgress.asMutable();
  let score = state.moves - state.goalMoves;

  let level = getChallengeName(state.routeSpec,state.trial);
  currentProgress[level] = getScoreValue(score);

  return currentProgress;
}
export function getChallengeName(routeSpec, trial){
  let {level, mission, challenge} = routeSpec,
      challengeName = `${level}:${mission}:${challenge}:${trial}`;
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

export function getChallengeScores(level, mission, challengeCount, progress) {
  let challengeScore = {},
      challengePrefix = level + ":" + mission + ":";
  for (let i = 0; i < challengeCount; i++){
    for (var key in progress){
      if (key.startsWith(challengePrefix + i)){
        const score = progress[key];
        if (challengeScore[i] == null) {
           challengeScore[i] = score;
        } else {
          // If there are multiple trials in a challenge, add them together
          challengeScore[i] += score;
        }
      }
    }
  }
  return challengeScore;
}
