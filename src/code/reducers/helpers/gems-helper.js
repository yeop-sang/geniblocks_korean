export const scoreValues = {
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2,
  NONE: 3,
  UNATTEMPTED: 4
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
  if (gems[level] && gems[level][mission] && gems[level][mission][challenge] != null) {
    let gemArray = gems[level][mission][challenge];
    return gemArray[gemArray.length-1];     // return last gem
  } else {
    return scoreValues.UNATTEMPTED;
  }
}

export function getMissionGems(level, mission, challengeCount, gems) {
  let challengeScore = [];
  for (let i = 0; i < challengeCount; i++){
    challengeScore.push(getChallengeGem(level, mission, i, gems));
  }
  return challengeScore;
}

export function isPassingGem(score) {
  return score <= scoreValues.BRONZE;
}
