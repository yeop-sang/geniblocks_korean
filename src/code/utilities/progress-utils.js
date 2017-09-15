import { getChallengeGem, isPassingGem } from '../reducers/helpers/gems-helper';

export default class AuthoringUtils {

  /**
   * Returns an object representing the current level, mission and challenge the user is on,
   * by returning the route spec first unattempted or failed challenge. If all challenges are complete,
   * returns the last challenge instead. Optionally, accepts a level number, to find the
   * current challenge on the given level instead.
   */
  static getCurrentChallengeFromGems(authoring, gems, levelNum) {
    let startLevel = !isNaN(levelNum) ? levelNum : 0,
        endLevel = !isNaN(levelNum) ? levelNum + 1 : authoring.application.levels.length;

    for (let i = startLevel, ii = endLevel; i < ii; i++) {
      let level = authoring.application.levels[i];
      for (let j = 0, jj = level.missions.length; j < jj; j++) {
        let mission = level.missions[j];
        for (let k = 0, kk = mission.challenges.length; k < kk; k++) {
          if (isPassingGem(getChallengeGem(i, j, k, gems))) {
            continue;
          } else {
            return {
              level: i,
              mission: j,
              challenge: k
            };
          }
        }
      }
    }

    // All challenges are complete
    let lastLevel = endLevel - 1,
        lastMission = authoring.application.levels[lastLevel].missions.length - 1,
        lastChallenge = authoring.application.levels[lastLevel].missions[lastMission].challenges.length - 1;
    return {
      level: lastLevel,
      mission: lastMission,
      challenge: lastChallenge
    };
  }

  /**
   * Returns true if any challenge in the given mission has been attempted.
   */
  static isMissionStarted(gems, level, mission) {
    let missionGems = gems[level] && gems[level][mission],
        started = false;
    if (missionGems) {
      for (let i = 0; i < missionGems.length; i++) {
        // we just care if there are any attempts, even failing ones
        if (missionGems[i] && missionGems[i].length > 0) {
          started = true;
        }
      }
    }
    return started;
  }

  /**
   * Returns true if the given mission is beyond the current mission, and is therefore inaccesible.
   *
   * FIXME: Unlocking all missions was requested as a TEMPORARY feature, to remove gating
   * entirely for the Fall 2017 teachers until we add a feature to put this under teacher
   * control. The smallest temporary way to do this, and make it easy to revert, is to simply
   * return `false` here.
   */
  static isMissionLocked(gems, authoring, level, mission) {
    // let currChallengeRoute = this.getCurrentChallengeFromGems(authoring, gems);

    // return level > currChallengeRoute.level
    //     || (level === currChallengeRoute.level && mission > currChallengeRoute.mission);
    return false;
  }

}
