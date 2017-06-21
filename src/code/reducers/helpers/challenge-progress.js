export const scoreValues = {
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2,
  NONE: 3
};

export function getGemFromChallengeErrors(challengeErrors){
  switch (challengeErrors) {
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

export function getChallengeGem(level, mission, challenge, gems) {
  if (gems[level] && gems[level][mission] && !isNaN(gems[level][mission][challenge])) {
    return gems[level][mission][challenge];
  } else {
    return scoreValues.NONE;
  }
}

export function getMissionGems(level, mission, challengeCount, gems) {
  let challengeScore = [];
  for (let i = 0; i < challengeCount; i++){
    challengeScore.push(getChallengeGem(level, mission, i, gems));
  }
  return challengeScore;
}
