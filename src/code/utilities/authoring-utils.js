export default class AuthoringUtils {
  static getChallengeDefinition(authoring, routeSpec) {
    const challengeId = this.getChallengeId(authoring, routeSpec);
    return authoring.definitions[challengeId];
  }

  static getChallengeId(authoring, routeSpec) {
    return authoring.levelHierarchy[routeSpec.level][routeSpec.mission][routeSpec.challenge];
  }
}
