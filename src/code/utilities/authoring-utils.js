export default class AuthoringUtils {
  static getChallengeDefinition(authoring, routeSpec) {
    const challengeId = this.getChallengeId(authoring, routeSpec),
          challenges = authoring.challenges;
    return challengeId && challenges ? authoring.challenges[challengeId] : null;
  }

  static getChallengeId(authoring, routeSpec) {
    const levels = authoring.levelHierarchy,
          missions = levels ? levels[routeSpec.level] : null,
          challenges = missions ? missions[routeSpec.mission] : null,
          challenge = challenges ? challenges[routeSpec.challenge] : null;
    return challenge ? challenge.challengeId : null;
  }

  static getLevelCount(authoring) {
    const levels = authoring.levelHierarchy;
    return levels ? levels.length : null;
  }

  static getMissionCount(authoring, level) {
    const levels = authoring.levelHierarchy,
          missions = levels ? levels[level] : null;
    return missions ? missions.length : null;
  }

  static getChallengeCount(authoring, level, mission) {
    const levels = authoring.levelHierarchy,
          missions = levels ? levels[level] : null,
          challenges = missions ? missions[mission] : null;
    return challenges.length;
  }

  static challengeIdToRouteParams(authoring, targetChallengeId) {
    if (!authoring || !targetChallengeId) {
      return null;
    }

    let routeSpec = null;
    authoring.levelHierarchy.forEach((level, levelIndex) => {
      level.forEach((mission, missionIndex) => {
        mission.forEach((challenge, challengeIndex) => {
          if (challenge.challengeId === targetChallengeId) {
            routeSpec = {level: String(levelIndex + 1), mission: String(missionIndex + 1), challenge: String(challengeIndex + 1)};
          }
        });
      });
    });
    return routeSpec;
  }
}
