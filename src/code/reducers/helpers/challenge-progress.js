export const scoreValues = {
  NONE: -1,
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2
};

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
    case 2:
      return scoreValues.BRONZE;
    default:
      return scoreValues.NONE;
  }
}

export function getChallengeScores(level, mission, challengeCount, gems) {
  let challengeScore = [];
  for (let i = 0; i < challengeCount; i++){
    if (gems[level] && gems[level][mission] && !isNaN(gems[level][mission][i])) {
      challengeScore.push(gems[level][mission][i]);
    } else {
      challengeScore.push(3);
    }
  }
  return challengeScore;
}
