import actionTypes from '../action-types';
import templates from '../templates';
import urlParams from '../utilities/url-params';
import AuthoringUtils from '../utilities/authoring-utils';

function isLocalHostUrl() {
  const host = window.location.hostname;
  return (host.indexOf('localhost') >= 0) || (host.indexOf('127.0.0.1') >= 0);
}

const logManagerUrl  = '//cc-log-manager.herokuapp.com/api/logs',
      // disable logging during development unless explicitly enabled
      isLoggingEnabled = !isLocalHostUrl() || (urlParams.log === "true");

const actionsToExclude = [
  actionTypes.SOCKET_CONNECTED,
  actionTypes.SOCKET_ERRORED,
  actionTypes.SOCKET_RECEIVED
];

var session = "";

export default loggingMetadata => store => next => action => {
  if (action.type === actionTypes.SESSION_STARTED) {
    session = action.session;
  }

  let result = next(action),
      nextState = store.getState();

  if (!actionsToExclude.indexOf(action.type) > -1 && session !== null){
    const message = createLogEntry(loggingMetadata, action, nextState);
    if (isLoggingEnabled)
      postToLogManager(message);
    console.log(`%c action`, `color: #03A9F4`, message);
  }
  return result;
};

function getValue(obj, path) {
  for (let i=0, ii=path.length; i<ii; i++){
      obj = obj[path[i]];
  }
  return obj;
}

function createLogEntry(loggingMetadata, action, nextState){
  const eventName = action.type,
        routeSpec = nextState.routeSpec,
        activity  = AuthoringUtils.getChallengeId(nextState.authoring, routeSpec);
  let parameters = { ...action };

  if (action.meta && action.meta.logNextState) {
    for (let prop in action.meta.logNextState) {
      parameters[prop] = getValue(nextState, action.meta.logNextState[prop]);
    }
  }
  if (action.meta && action.meta.logTemplateState) {
    let Template = templates[nextState.template];
    if (Template.logState) {
      let templateState = Template.logState(nextState);
      parameters = {
        ...parameters,
        ...templateState
      };
    }
  }
  if (action.meta && action.meta.dontLog) {
    for (let prop of action.meta.dontLog) {
      delete parameters[prop];
    }
  }

  delete parameters.type;
  delete parameters.meta;

  const message =
    {
      application: loggingMetadata.applicationName,
      username: loggingMetadata.userName,
      session: session,
      time: Date.now(),
      activity: activity,
      event: eventName,
      parameters: parameters
    };
  return message;
}

function postToLogManager(data) {
  let request = new XMLHttpRequest();
  request.open('POST', logManagerUrl, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(data));
}
