import actionTypes from '../action-types';
import { getClassId, getUserId } from '../utilities/url-params';

export const authoringVersionNumber = 1;

export default () => store => next => action => {
  let result = next(action);

  if (action.type === actionTypes.CHALLENGE_COMPLETED) {
      let userQueryString = getUserQueryString();

      if (userQueryString) {
        let nextState = store.getState(),
            gems = nextState.gems,
            stateUpdate = {state: gems};
          
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