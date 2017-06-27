/**
 * This is based off the middleware provided by react-router-redux.
 *
 * This is extracted to our own middleware to allow us to use our own
 * semantically-meaningful actions, and to pass the actions forward so
 * that they may be logged.
 */

import actionTypes from '../action-types';

export default function routerMiddleware(history) {
  return () => next => action => {
    if (action.type === actionTypes.NAVIGATED && action.route) {
      history.push(action.route);
    } else if (action.type === actionTypes.NAVIGATED_HOME) {
      history.push("home");
    }

    return next(action);
  };
}
