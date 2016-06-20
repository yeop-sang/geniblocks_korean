import { actionTypes } from '../actions';

const logManagerUrl  = '//cc-log-manager.herokuapp.com/api/logs';

export default loggingMetadata => store => next => action => {
  const actionsToExclude = [
    actionTypes.SOCKET_CONNECTED,
    actionTypes.SOCKET_ERRORED,
    actionTypes.SOCKET_RECEIVED
  ];
  if (!actionsToExclude.includes(action.type)){
    const message = createLogEntry(loggingMetadata, action, store);
    postToLogManager(message);
    // console.log(`%c action`, `color: #03A9F4`, message);
  }
  return next(action);
};

function createLogEntry(loggingMetadata, action){
  let eventName = action.type,
      parameters = { ...action };
  delete parameters.type;
  const message =
    {
      application: loggingMetadata.applicationName,
      // activity: "case#-challenge-#",
      username: "testuser-"+loggingMetadata.session.split("-")[0],
      session: loggingMetadata.session,
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
