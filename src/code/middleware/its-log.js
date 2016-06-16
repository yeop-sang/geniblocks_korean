
import { actionTypes } from '../actions';

export default socket => store => next => action => {
  const filteredActionTypesToSend = [actionTypes.CHROMESOME_ALLELE_CHANGED, actionTypes.SEX_CHANGED, actionTypes.NAVIGATE_NEXT_CHALLENGE];

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
      if (filteredActionTypesToSend.includes(action.type)){
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

        // TODO: replace testData with real data when ready
        socket.send(JSON.stringify(testData));
      }
    }
  }

  return next(action);
};