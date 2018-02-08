/* globals firebase */

/**
 Our current user state:

  {
    state: < saveable state (i.e. gems) >,
    stateVersion: n,
    stateMeta: {
      lastActionTime: t
      currentChallenge: {l, m, c}
    },
    itsData: < set by ITS >
  }
 */

import actionTypes from '../action-types';
import progressUtils from '../utilities/progress-utils';
import { userAuth } from "../utilities/firebase-auth";
import { currentStateVersion } from '../migrations';

export const authoringVersionNumber = 1;
const userQueryString = getUserQueryString();

export default () => store => next => action => {
  let prevState = store.getState(),
      result = next(action),
      nextState = store.getState();

  // If we have a FB query string, update timestamp on every action,
  // and update savable state (gems) if they have changed
  if (userQueryString) {
    let time = firebase.database.ServerValue.TIMESTAMP,
        currentChallenge = getCurrentChallenge(nextState),
        stateMeta = {
          lastActionTime: time,
          currentChallenge
        },
        userDataUpdate = {stateMeta: stateMeta};

    // Store updated gems if they have changed
    if (action.type !== actionTypes.LOAD_SAVED_STATE &&
          JSON.stringify(prevState.gems) !== JSON.stringify(nextState.gems)) {
      let gems = nextState.gems;
      userDataUpdate.state = {
        gems,
        stateVersion: currentStateVersion
      };
    }
    firebase.database().ref(userQueryString).update(userDataUpdate);
  }

  return result;
};

const getCurrentChallenge = function(nextState) {
  const {routeSpec, authoring, gems} = nextState;
  if (!authoring) {
    return null;
  } else if (routeSpec && routeSpec.level !== undefined) {
    return {
      level: routeSpec.level,
      mission: routeSpec.mission,
      challenge: routeSpec.challenge
    };
  } else {
    return progressUtils.getCurrentChallengeFromGems(authoring, gems);
  }
};

export function getUserQueryString() {
  const classId = getClassId(),
        userId = getUserId();

  return (classId && userId) ? authoringVersionNumber + "/userState/" + classId + "/" + userId : null;
}

function getClassId() {
  return convertUrlToFirebaseKey(userAuth().class_info_url);
}

function getUserId() {
  return convertUrlToFirebaseKey(userAuth().domain) + userAuth().domain_uid;
}

function convertUrlToFirebaseKey(url) {
  if (!url) {
    return null;
  }
  // Convert invalid Firebase characters (inluding periods) to their ASCII equivalents
  return encodeURIComponent(url).replace(/\./g, "%2E");
}
