import { getChallengeGem, isPassingGem } from '../reducers/helpers/gems-helper';

export default class AuthoringUtils {

  /**
   * Returns an object representing the current level, mission and challenge the user is on,
   * by returning the first unstarted challenge of the next started or unstarted mission
   * after the last mission the user has any gems for. If all challenges are complete,
   * returns the last challenge instead.
   */
  static getCurrentChallengeFromGems(authoring, gems) {
    let levels = authoring.application.levels,
        startLevel = 0,
        endLevel = levels.length - 1;

    let nextUnstartedChallenge;

    // Go backwards through the challenges to find the last mission the user has gems
    for (let i = endLevel, ii = startLevel; i >= ii; i--) {
      let level = levels[i];
      for (let j = level.missions.length - 1; j >= 0; j--) {
        let mission = level.missions[j];
        let gemInMission = false;
        let lowestMissingGem;
        for (let k = mission.challenges.length - 1; k >= 0; k--) {
          if (isPassingGem(getChallengeGem(i, j, k, gems))) {
            gemInMission = true;
          } else {
            if (gemInMission) {
              // if we've already found a gem in this mission, lowestMissingGem will be
              // the lowest challenge in this mission without a gem
              lowestMissingGem = k;
            } else {
              // if we haven't found a gem yet, this will always be the last seen challenge
              nextUnstartedChallenge = {
                level: i,
                mission: j,
                challenge: k
              };
            }
          }
        }
        if (gemInMission) {
          if (lowestMissingGem !== undefined) {
            return {
              level: i,
              mission: j,
              challenge: lowestMissingGem
            };
          } else if (nextUnstartedChallenge) {  // this is only null if user has completed all
            // this may be the next challenge in the same mission, or the first
            // challenge of the next mission
            return nextUnstartedChallenge;
          }
        }
      }
    }

    // No challenges or all challenges have been completed
    return {
      level: 0,
      mission: 0,
      challenge: 0
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
