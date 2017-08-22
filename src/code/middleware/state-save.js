/* globals firebase */

/**
 Our current user state:

 {
   state: < saveable state (i.e. gems) >,
   stateVersion: 1,
   stateMeta: { lastActionTime: t },
   itsData: < set by ITS >
 }
 */

import urlParams from '../utilities/url-params';
import actionTypes from '../action-types';

export const authoringVersionNumber = 1;

const stateVersionNumber = 1;
const userQueryString = getUserQueryString();

export default () => store => next => action => {
  let prevState = store.getState(),
      result = next(action),
      nextState = store.getState();

  // If we have a FB query string, update timestamp on every action,
  // and update savable state (gems) if they have changed
  if (userQueryString) {
    let timeInSec = Math.floor(Date.now() / 1000),
        stateMeta = {lastActionTime: timeInSec},
        userDataUpdate = {stateMeta: stateMeta};

    // Store updated gems if they have changed
    if (action.type !== actionTypes.LOAD_SAVED_STATE &&
          JSON.stringify(prevState.gems) !== JSON.stringify(nextState.gems)) {
      let gems = nextState.gems;
      userDataUpdate.state = {gems};
      userDataUpdate.stateVersion = stateVersionNumber;
    }
    firebase.database().ref(userQueryString).update(userDataUpdate);
  }

  return result;
};

export function getUserQueryString() {
  const classId = getClassId(),
        userId = getUserId();

  return (classId && userId) ? authoringVersionNumber + "/userState/" + classId + "/" + userId : null;
}

function getClassId() {
  return convertUrlToFirebaseKey(urlParams.class_info_url);
}

function getUserId() {
  return convertUrlToFirebaseKey(urlParams.domain) + urlParams.domain_uid;
}

function convertUrlToFirebaseKey(url) {
  if (!url) {
    return null;
  }
  // Convert invalid Firebase characters (inluding periods) to their ASCII equivalents
  return encodeURIComponent(url).replace(/\./g, "%2E");
}
