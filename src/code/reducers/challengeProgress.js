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
  let level = `${state.case}:${state.challenge}:${state.trial}`;
  currentProgress[level] = scoreValue;

  return currentProgress;
}