import actionTypes from '../action-types';
import { getReturnUrlId } from '../utilities/url-params';

export default () => store => next => action => {
  let result = next(action),
      nextState = store.getState();

  if (action.type === actionTypes.CHALLENGE_COMPLETED) {
      let gems = nextState.gems, 
          update = {};

      update[getReturnUrlId()] = gems;
      firebase.database().ref().update(update);
    }

  return result;
};
