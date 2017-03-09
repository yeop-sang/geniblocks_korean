import actionTypes from '../action-types';
import templates from '../templates';
import GuideProtocol from '../utilities/guide-protocol';

var session = "",
    sequence = 0;

export default (socket) => store => next => action => {

  let result = next(action),
      nextState = store.getState();

  if (action.type === actionTypes.SESSION_STARTED) {
    session = action.session;
  }

  switch(action.type) {
    case actionTypes.GUIDE_ERRORED: {
      console.log("Error connecting to ITS");
      socket.close();
      break;
    }
    case actionTypes.GUIDE_CONNECTED: {
      console.log("Connection Success!");
      break;
    }
    case actionTypes.GUIDE_MESSAGE_RECEIVED:
    case actionTypes.GUIDE_ALERT_RECEIVED: {
      console.log("Message received!", action.data);
      break;
    }
    default: {
      // other action types - send to ITS
      if (action.meta && action.meta.itsLog){
        let message = createLogEntry(action, nextState);
        sendMessage(message, socket);
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

function createLogEntry(action, nextState){
  let event = { ...action.meta.itsLog },
      context = { ...action };

  // TODO: use a unique identifier here so we can move challenges without confusing ITS
  context["routeSpec"] = nextState.routeSpec;

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
      username: "testuser-"+session.split("-")[0],
      session: session,
      time: Date.now(),
      sequence: sequence,
      ...event,
      context: context
    };

  sequence++;
  return message;
}
