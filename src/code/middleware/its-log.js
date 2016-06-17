import { actionTypes } from '../actions';
import { logEntry } from './gv-log';

export default (socket, session) => store => next => action => {

  const actionsToExclude = [
    actionTypes.SOCKET_CONNECT,
    actionTypes.SOCKET_ERROR,
    actionTypes.SOCKET_RECEIVE,
    actionTypes.LOAD_CHALLENGE_FROM_AUTHORING
    ];

  switch(action.type) {
    case actionTypes.SOCKET_ERROR: {
      console.log("Error connecting to ITS");
      socket.close();
      break;
    }
    case actionTypes.SOCKET_CONNECT: {
      console.log("Connection Success!");
      break;
    }
    case actionTypes.SOCKET_RECEIVE: {
      console.log("Message received!", action.state.data);
      break;
    }
    default: {
      // other action types - send to ITS 
      if (!actionsToExclude.includes(action.type)){

        const logData = logEntry(session, action);

        // while we prepare for real ITS integration, use dummy data placeholder
        const testData = {"event": {
                "session": "e612ed8b-5305-4b80-87d7-3d2716219901",
                "time": 1448439534306,
                "prettyTime": "Wed Nov 25 2015 00:18:54 GMT-0800 (PST)",
                "timeDrift": -28799510,
                "event": "User logged in",
                "parameters": {
                    "UniqueID": "SAM"
                }
        }};

        switch (socket.readyState) {
          case WebSocket.CONNECTING:
            // not ready to send
            // TODO: decide how long before we timeout - do we show errors?
            console.log("Data not sent - socket state: CONNECTING");
            break;
          case WebSocket.OPEN:
            // TODO: replace testData with logData when ready
            socket.send(JSON.stringify(testData));
            break;
          case WebSocket.CLOSING:
            // TODO: Are we going to forcibly close the socket at any point?
            console.log("Data not sent - socket state: CLOSING");
            break;
          case WebSocket.CLOSED:
            // TODO: Control reconnection logic / may change if we go socket.io
            console.log("Data not sent - socket state: CLOSED");
            break;
        }
      }
    }
  }

  return next(action);
};