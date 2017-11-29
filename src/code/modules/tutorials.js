import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import t from '../utilities/translate';
import tutorialSteps from './tutorial.json';

export const tutorialActionTypes = {
  TUTORIAL_ENABLED: "Tutorial enabled",
  TUTORIAL_STARTED: "Tutorial started",
  TUTORIAL_COMPLETE: "Tutorial completed",
  TUTORIAL_SKIPPED: "Tutorial skipped"
};
const initialState = Immutable([]);

export default function tutorials(state = initialState, action) {
  switch (action.type) {
    case tutorialActionTypes.TUTORIAL_ENABLED:
      return state;
    case tutorialActionTypes.TUTORIAL_STARTED:
      return state;
    case tutorialActionTypes.TUTORIAL_COMPLETE:
      return state;
    case tutorialActionTypes.TUTORIAL_SKIPPED:
      return state;
    case actionTypes.NAVIGATED: {
      return getTutorialForCurrentStage(action.level, action.mission, action.challenge);
    }
    case actionTypes.ENTERED_CHALLENGE_FROM_ROOM: {
      return state;
    }

    default:
      return state;
  }
}

function getTutorialForCurrentStage(l, m, c) {
  let levelTutorials = tutorialSteps.levels.filter(lvl => lvl.level === l);
  if (levelTutorials.length !== 1) return [];

  let levelMissions = levelTutorials[0].missions.filter(ms => ms.mission === m);
  if (levelMissions.length !== 1) return [];

  let levelChallenges = levelMissions[0].challenges.filter(ch => ch.challenge === c);
  if (levelChallenges.length !== 1) return [];
  else return levelChallenges[0].steps;
}