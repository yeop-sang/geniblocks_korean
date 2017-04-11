import actionTypes from '../action-types';
import templates from '../templates';
import GuideProtocol from '../utilities/guide-protocol';
import { GUIDE_CONNECTED, GUIDE_ERRORED,
         GUIDE_MESSAGE_RECEIVED, GUIDE_ALERT_RECEIVED } from '../modules/notifications';
import io from 'socket.io-client';
import AuthoringUtils from '../utilities/authoring-utils';

var socket = null,
    session = "",
    sequence = 0,
    isConnectonEstablished = false,
    msgQueue = [];

export function initializeITSSocket(guideServer, guideProtocol, store) {
  socket = io(`${guideServer}/${guideProtocol}`, {reconnection: false});
  socket.on('connect', data =>
    store.dispatch({type: GUIDE_CONNECTED, data})
  );
  socket.on(GuideProtocol.TutorDialog.Channel, data =>
    store.dispatch({type: GUIDE_MESSAGE_RECEIVED, data: GuideProtocol.TutorDialog.fromJson(data)})
  );
  socket.on(GuideProtocol.Alert.Channel, (data) =>
    store.dispatch({type: GUIDE_ALERT_RECEIVED, data: GuideProtocol.Alert.fromJson(data)})
  );
  socket.on('connect_error', data =>
    store.dispatch({type: GUIDE_ERRORED, data})
  );

  return socket;
}

export default loggingMetadata => store => next => action => {

  let result = next(action),
      nextState = store.getState();

  if (action.type === actionTypes.SESSION_STARTED) {
    session = action.session;
  }

  switch(action.type) {
    case GUIDE_ERRORED: {
      console.log("Error connecting to ITS!");
      socket.close();
      break;
    }
    case GUIDE_CONNECTED: {
      console.log("Connection Success!");
      if (msgQueue.length) {
        msgQueue.forEach((msg, index) => {
          // use setTimeout to stagger messages sent to ITS
          setTimeout(() => {
            console.log("Sending queued message to ITS:", msg);
            sendMessage(msg, socket);
          }, 10 * index);
        });
        msgQueue = [];
      }
      isConnectonEstablished = true;
      break;
    }
    case GUIDE_MESSAGE_RECEIVED:
    case GUIDE_ALERT_RECEIVED: {
      console.log("Message received from ITS:", action.data);
      break;
    }
    default: {
      // other action types - send to ITS
      if (action.meta && action.meta.itsLog){
        let message = createLogEntry(loggingMetadata, action, nextState);
        if (!isConnectonEstablished) {
          console.log("Queuing message for ITS:", message);
          msgQueue.push(message);
        }
        else {
          console.log("Sending message to ITS:", message);
          sendMessage(message, socket);
        }
      }
    }
  }

  return result;
};

function sendMessage(message, socket) {
  socket.emit(GuideProtocol.Event.Channel, JSON.stringify(message));
}

function getValue(obj, path) {
  for (let i=0, ii=path.length; i<ii; i++){
      obj = obj[path[i]];
  }
  return obj;
}

// exported for unit test purposes
export function makeMutable(obj) {
  if (!obj) return obj;
  if (obj.asMutable) {
    return obj.asMutable({deep: true});
  } else if (obj.isArray) {
    for (let item of obj) {
      item = makeMutable(item);
    }
  } else if (typeof obj === "object") {
    for (let key in obj) {
      obj[key] = makeMutable(obj[key]);
    }
  }
  return obj;
}

// exported for unit test purposes
export function changePropertyValues(obj, key, func) {
  if (!obj) return;
  if (obj.isArray) {
    for (let item of obj) {
      changePropertyValues(item, key, func);
    }
  } else for (let prop in obj) {
      if (prop === key) {
        obj[prop] = func(obj[prop]);
      } else if (typeof obj[prop] === "object") {
        changePropertyValues(obj[prop], key, func);
      }
    }
}

function createLogEntry(loggingMetadata, action, nextState){
  let event = { ...action.meta.itsLog },
      context = { ...action },
      routeSpec = nextState.routeSpec;

  context["routeSpec"] = routeSpec;
  context["groupId"] = "verticalBite";
  context["challengeId"] = AuthoringUtils.getChallengeId(nextState.authoring, routeSpec);

  if (action.meta.logNextState) {
    for (let prop in action.meta.logNextState) {
      context[prop] = getValue(nextState, action.meta.logNextState[prop]);
    }
  }
  if (action.meta.logTemplateState) {
    let Template = templates[nextState.template];
    if (Template.logState) {
      let templateState = Template.logState(nextState);
      context = {
        ...context,
        ...templateState
      };
    }
  }
  if (action.meta.dontLog) {
    for (let prop of action.meta.dontLog) {
      delete context[prop];
    }
  }

  delete context.type;
  delete context.meta;

  context = makeMutable(context);

  let changeSexToString = sex => sex === 0 ? "male" : "female";
  changePropertyValues(context, "sex", changeSexToString);
  changePropertyValues(context, "newSex", changeSexToString);

  const message =
    {
      username: loggingMetadata.userName,
      classInfo: loggingMetadata.classInfo,
      studentId: loggingMetadata.studentId,
      externalId: loggingMetadata.externalId,
      session: session,
      time: Date.now(),
      sequence: sequence,
      ...event,
      context: context
    };

  sequence++;
  return message;
}
