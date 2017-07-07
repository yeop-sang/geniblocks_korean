import { scoreValues } from '../reducers/helpers/gems-helper';

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

  static getPreviousMission(authoring, level, mission) {
    if (mission > 0) {
      return {
        level,
        mission: mission - 1
      };
    } else if (level > 0) {
      return {
        level: level - 1,
        mission: authoring.application.levels[level - 1].missions.length - 1
      };
    } else {
      return null;
    }
  }

  /**
   * Returns an object representing the current mission and challenge the user is on in the given level,
   * by finding the first challenge which is failed or incomplete. If all challenges are complete,
   * returns the last challenge instead.
   * 
   * @param {Object} authoring - the authored hierarchy of levels
   * @param {Object} gems - the earned gems of the user
   * @param {number} levelNum - optionally, the level for which the next challenge should be found
   * @returns {Object} - an object representing the next level, mission and challenge based on the given
   *                     parameters. Also contains a flag representing whether or not the returned mission
   *                     has been started by the user.
   */
  static getCurrentChallengeFromGems(authoring, gems, levelNum) {
    let startLevel = !isNaN(levelNum) ? levelNum : 0,
        endLevel = !isNaN(levelNum) ? levelNum + 1 : authoring.application.levels.length,
        lastLevel = 0, lastMission = 0, lastChallenge = 0;
    for (let i = startLevel, ii = endLevel; i < ii; i++) {
      let level = authoring.application.levels[i];
      lastLevel = i;
      for (let j = 0, jj = level.missions.length; j < jj; j++) {
        let mission = level.missions[j],
            nextChallenge = -1,
            isStarted = false;
        lastMission = j;
        for (let k = 0, kk = mission.challenges.length; k < kk; k++) {
          lastChallenge = k;
          let challengeGem = gems[i] && gems[i][j] && gems[i][j][k];
          if ((isNaN(challengeGem) || challengeGem === scoreValues.NONE) && nextChallenge === -1) {
            // Mark the first incomplete or failed challenge as the next one
            nextChallenge = k;
          }

          // We must iterate over all the challenges to see if any were attempted, even if we already
          // found the next challenge
          if (!isNaN(challengeGem)) {
            isStarted = true;
          }
        }

        if (nextChallenge === -1) {
          // All challenges were passed for this mission, so check the next one
          continue;
        } else {
          return {
            level: i,
            mission: j,
            challenge: nextChallenge,
            missionStarted: isStarted
          };
        }
      }
    }

    // All challenges are complete
    return {
      level: lastLevel,
      mission: lastMission,
      challenge: lastChallenge,
      missionStarted: true
    };
  }
}
