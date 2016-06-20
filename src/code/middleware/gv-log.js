import { actionTypes } from '../actions';

export default loggingMetadata => store => next => action => {
  const actionsToExclude = [
    actionTypes.SOCKET_CONNECTED,
    actionTypes.SOCKET_ERRORED,
    actionTypes.SOCKET_RECEIVED
  ];
  if (!actionsToExclude.includes(action.type)){
    const message = logEntry(loggingMetadata, action, store);
    // TODO: handle regular logging to endpoint
    console.log(`%c action`, `color: #03A9F4`, message);
  }
  return next(action);
};

export function logEntry(loggingMetadata, action){
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
