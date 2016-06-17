import { actionTypes } from '../actions';

export default session => store => next => action => {
  const actionsToExclude = [
    actionTypes.SOCKET_CONNECT,
    actionTypes.SOCKET_ERROR,
    actionTypes.SOCKET_RECEIVE
  ];
  if (!actionsToExclude.includes(action.type)){
    const message = logEntry(session, action);
    // TODO: handle regular logging to endpoint
    console.log(`%c action`, `color: #03A9F4`, message);
  }
  return next(action);
};

export function logEntry(session, action){
  const message = 
    {
      application: "test",
      activity: "case#-challenge-#",
      username: "testuser",
      session: session,
      time: Date.now(),
      event: action.type,
      event_value: "",
      parameters: action.parameters
    };
  return message;
}