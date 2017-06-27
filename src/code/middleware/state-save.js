import { getClassId, getUserId } from '../utilities/url-params';

export const authoringVersionNumber = 1;

const stateVersionNumber = 1;

export default () => store => next => action => {
  let prevState = store.getState(),
      result = next(action),
      nextState = store.getState();

  // Store updated gems if they have changed
  if (JSON.stringify(prevState.gems) !== JSON.stringify(nextState.gems)) {
      let userQueryString = getUserQueryString();

      if (userQueryString) {
        let gems = nextState.gems,
            stateUpdate = {state: {gems}, stateVersion: stateVersionNumber};
          
        firebase.database().ref(userQueryString).update(stateUpdate); //eslint-disable-line
      }
    }

  return result;
};

export function getUserQueryString() {
  const classId = getClassId(),
        userId = getUserId();

  return (classId && userId) ? authoringVersionNumber + "/userState/" + classId + "/" + userId : null;
}