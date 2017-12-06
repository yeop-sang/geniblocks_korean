import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import t from '../utilities/translate';
import tutorialSteps from './tutorial.json';

const tutorialActionTypes = {
  TUTORIAL_NEXT: "Tutorial next",
  TUTORIAL_PREVIOUS: "Tutorial previous",
  TUTORIAL_MORE: "Tutorial more",
  TUTORIAL_CLOSED: "Tutorial closed",
  TUTORIAL_RESTARTED: "Tutorial restarted"
};
const initialState = Immutable({
                              // which tutorials are available for this challenge
                              steps: [],
                              // which tutorial we are showing
                              currentStep: 0,
                              // whether the 'more' text is visible
                              moreVisible: false,
                              // whether the tutorials are currently showing
                              visible: true
                            });

Immutable([]);

export default function tutorials(state = initialState, action) {
  const currentStep = state.currentStep;
  const totalSteps = state.steps.length;
  switch (action.type) {
    case actionTypes.NAVIGATED:
      return initialState.set('steps', getTutorialForCurrentStage(action.level, action.mission, action.challenge));
    case tutorialActionTypes.TUTORIAL_NEXT:
      return Object.assign({}, state, {
        currentStep: Math.min(currentStep + 1, totalSteps - 1),
        moreVisible: false
      });
    case tutorialActionTypes.TUTORIAL_PREVIOUS:
      return Object.assign({}, state, {
        currentStep: Math.max(currentStep - 1, 0),
        moreVisible: false
      });
    case tutorialActionTypes.TUTORIAL_MORE:
      return state.set('moreVisible', true);
    case tutorialActionTypes.TUTORIAL_CLOSED:
      return state.set('visible', false);
    case tutorialActionTypes.TUTORIAL_RESTARTED:
      return Object.assign({}, state, {
        visible: true,
        currentStep: 0,
        moreVisible: false
      });

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

export function tutorialNext() {
  return {
    type: tutorialActionTypes.TUTORIAL_NEXT
  };
}

export function tutorialPrevious() {
  return {
    type: tutorialActionTypes.TUTORIAL_PREVIOUS
  };
}

export function tutorialMore() {
  return {
    type: tutorialActionTypes.TUTORIAL_MORE
  };
}

export function tutorialClosed() {
  return {
    type: tutorialActionTypes.TUTORIAL_CLOSED
  };
}

export function restartTutorial() {
  return {
    type: tutorialActionTypes.TUTORIAL_RESTARTED
  };
}

