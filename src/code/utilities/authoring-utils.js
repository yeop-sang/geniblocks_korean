export default class AuthoringUtils {
  static getChallengeDefinition(authoring, routeSpec) {
    const challengeId = this.getChallengeId(authoring, routeSpec),
          challenges = authoring.challenges;
    return challengeId && challenges ? authoring.challenges[challengeId] : null;
  }

  static getChallengeMeta(authoring, routeSpec) {
    if (!routeSpec) {
      return null;
    }
    const levels = authoring.application.levels,
          missions = levels ? levels[routeSpec.level].missions : null,
          challenges = missions ? missions[routeSpec.mission].challenges : null,
          challengeMeta = challenges ? challenges[routeSpec.challenge] : null;
    return challengeMeta;
  }

  static getChallengeId(authoring, routeSpec) {
    let meta = this.getChallengeMeta(authoring, routeSpec);
    return meta ? meta.id : null;
  }

  static getLevelCount(authoring) {
    const levels = authoring.application.levels;
    return levels ? levels.length : null;
  }

  static getMissionCount(authoring, level) {
    const levels = authoring.application.levels,
          missions = levels ? levels[level].missions : null;
    return missions ? missions.length : null;
  }

  static getChallengeCount(authoring, level, mission) {
    const levels = authoring.application.levels,
          missions = levels ? levels[level].missions : null,
          challenges = missions ? missions[mission].challenges : null;
    return challenges.length;
  }

  static challengeIdToRouteParams(authoring, targetChallengeId) {
    if (!authoring || !targetChallengeId) {
      return null;
    }

    let routeSpec = null;
    authoring.application.levels.forEach((level, levelIndex) => {
      level.missions.forEach((mission, missionIndex) => {
        mission.challenges.forEach((challenge, challengeIndex) => {
          if (challenge.id === targetChallengeId) {
            routeSpec = {level: String(levelIndex + 1), mission: String(missionIndex + 1), challenge: String(challengeIndex + 1)};
          }
        });
      });
    });
    return routeSpec;
  }

  /**
   * Returns an object representing the current level+mission the user is on,
   * and whether the user has completed at least one challenge in the mission.
   */
  static getCurrentMissionFromGems(authoring, gems) {
    for (let i = 0, ii = authoring.application.levels.length; i < ii; i++) {
      let level = authoring.application.levels[i];
      for (let j = 0, jj = level.missions.length; j < jj; j++) {
        let mission = level.missions[j];
        for (let k = 0, kk = mission.challenges.length; k < kk; k++) {
          if (gems[i] && gems[i][j] && !isNaN(gems[i][j][k])) {
            continue;
          } else {
            return {
              level: i,
              mission: j,
              started: k > 0
            };
          }
        }
      }
    }
  }
}
