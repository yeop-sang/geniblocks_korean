import { actionTypes } from '../actions';
import templates from '../templates';

const logManagerUrl  = '//cc-log-manager.herokuapp.com/api/logs';

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

  if (!actionsToExclude.includes(action.type) && session !== null){
    const message = createLogEntry(loggingMetadata, action, nextState);
    // postToLogManager(message);
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
  let eventName = action.type,
      parameters = { ...action };

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

  delete parameters.type;
  delete parameters.meta;

  const message =
    {
      application: loggingMetadata.applicationName,
      // activity: "case#-challenge-#",
      username: "testuser-"+session.split("-")[0],
      session: session,
      time: Date.now(),
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
