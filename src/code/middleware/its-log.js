import actionTypes from '../action-types';
import templates from '../templates';
import GuideProtocol from '../utilities/guide-protocol';
import { GUIDE_CONNECTED, GUIDE_ERRORED,
  GUIDE_HINT_RECEIVED, GUIDE_ALERT_RECEIVED } from '../modules/notifications';
import { requestRemediation } from '../modules/remediation';
import GeneticsUtils from '../utilities/genetics-utils';
import io from 'socket.io-client';
import AuthoringUtils from '../utilities/authoring-utils';
import { cloneDeep } from 'lodash';

var socket = null,
    session = "",
    sequence = 0,
    isConnectonEstablished = false,
    msgQueue = [];

export function initializeITSSocket(guideServer, socketPath, store) {
  socket = io(guideServer, {
    path: socketPath,
    reconnection: false
  });

  socket.on('connect', data =>
    store.dispatch({type: GUIDE_CONNECTED, data})
  );

  const receiveITSEvent = (data) => {
    var event = GuideProtocol.Event.fromJson(data);
    console.info(`%c Received from ITS: ${event.action} ${event.target}`, 'color: #f99a00', event);

    if (event.isMatch("ITS", "HINT", "USER")) {
      // TODO: Remove console log once ITS debugging is complete
      console.log("ITS provided hint to user:", event);
      store.dispatch({type: GUIDE_HINT_RECEIVED, data: event});
    } else if (event.isMatch("ITS", "REMEDIATE", "USER")) {
      // TODO: Remove console log once ITS debugging is complete
      console.log("ITS offered user remediation:", event);
      store.dispatch(requestRemediation(event));
    } else if (event.isMatch("ITS", "SPOKETO", "USER")) {
      // do nothing with this
      console.log("ITS spoke to user:", event.context.dialog);
    } else if (event.isMatch("ITS", "ISSUED", "ALERT")) {
      // TODO: Remove console log once ITS debugging is complete
      console.log("ITS alerted user:", event);
      store.dispatch({type: GUIDE_ALERT_RECEIVED, data: event});
    } else {
      console.log("%c Unhandled ITS message:", 'color: #f99a00', event.toString());
    }
  };

  socket.on(GuideProtocol.Event.Channel, receiveITSEvent);

  // for testing
  window.GV_TEST_receiveITSEvent = receiveITSEvent;

  socket.on('error', data =>
    store.dispatch({type: GUIDE_ERRORED, data})
  );
  socket.on('connect_error', data =>
    store.dispatch({type: GUIDE_ERRORED, data})
  );
  socket.on('reconnect_error', data =>
    store.dispatch({type: GUIDE_ERRORED, data})
  );

  return socket;
}

export default loggingMetadata => store => next => action => {

  let prevState = store.getState(),
      result = next(action),
      nextState = store.getState();

  if (action.type === actionTypes.SESSION_STARTED) {
    session = action.session;
  }

  switch(action.type) {
    case GUIDE_ERRORED: {
      console.log("%c Error connecting to ITS!", 'color: #f99a00');
      socket.close();
      break;
    }
    case GUIDE_CONNECTED: {
      console.log("%c ITS Connection Success!", 'color: #f99a00');
      if (msgQueue.length) {
        msgQueue.forEach((msg, index) => {
          // use setTimeout to stagger messages sent to ITS
          setTimeout(() => {
            console.log("%c Sending queued message to ITS:", 'color: #f99a00', msg);
            sendMessage(msg, socket);
          }, 10 * index);
        });
        msgQueue = [];
      }
      isConnectonEstablished = true;
      break;
    }
    case GUIDE_HINT_RECEIVED:
    case GUIDE_ALERT_RECEIVED: {
      break;
    }
    default: {
      // other action types - send to ITS
      if (action.meta && action.meta.itsLog){
        let message = createLogEntry(loggingMetadata, action, prevState, nextState);
        if (!isConnectonEstablished) {
          console.log("%c Queuing message for ITS:", 'color: #f99a00', message);
          msgQueue.push(message);
        }
        else {
          console.log("%c Sending message to ITS:", 'color: #f99a00', message, JSON.stringify(message));
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

function getChallengeType(state) {
  if (state.template === "FVEggSortGame") {
    return "Hatchery";
  }
  if (state.template === "ClutchGame") {
    if (state.challengeType && state.challengeType === "match-target") {
      return "Breeding";
    } else if (state.challengeType && state.challengeType === "submit-parents") {
      return "Siblings";
    } else {  // challengeType === "test-cross", nothing for this yet
      return null;
    }
  }
  if (state.template === "FVEggGame" ||
      state.challengeType && state.challengeType === "match-target") {
    return "Sim";
  }
}

function getSelectableAttributes(nextState) {
  if ((nextState.template && nextState.template === "FVGenomeChallenge") ||
      (nextState.challengeType && nextState.challengeType === "submit-parents")) {
    return ["sex", ...nextState.userChangeableGenes];
  }
  if (nextState.template && nextState.template === "FVEggSortGame") {
    if (nextState.baskets && nextState.baskets[0] && nextState.baskets[0].sex !== undefined) {
      return ["sex", ...nextState.visibleGenes];
    } else {
      return [...nextState.visibleGenes];
    }
  }
  if (nextState.template && nextState.template === "ClutchGame") {
    if (nextState.userChangeableGenes) {
      let selectableAttributes = nextState.userChangeableGenes[0].mother.length > 0 ? nextState.userChangeableGenes[0].mother : nextState.userChangeableGenes[0].father;
      return [...selectableAttributes];
    }
  }
}

function getTarget(nextState) {
  let targetIndex;
  if ((nextState.template && nextState.template === "FVGenomeChallenge") &&
      (nextState.challengeType && nextState.challengeType === "match-target")) {
    targetIndex = 1;
  } else {
    return;
  }
  let targetDrakeOrg = GeneticsUtils.convertDrakeToOrg(nextState.drakes[targetIndex]);
  return {
    sex: targetDrakeOrg.sex,
    phenotype: targetDrakeOrg.phenotype.characteristics
  };
}

function getSelected(action, nextState) {
  let userIndex;
  if (action.type === actionTypes.ALLELE_CHANGED &&
      (nextState.template && nextState.template === "FVGenomeChallenge") &&
      (nextState.challengeType && nextState.challengeType === "match-target")) {
    userIndex = 0;
  } else {
    return;
  }
  let userDrakeOrg = GeneticsUtils.convertDrakeToOrg(nextState.drakes[userIndex]);
  return {
    sex: userDrakeOrg.sex,
    alleles: userDrakeOrg.getAlleleString()
  };
}

function getPrevious(selected, action, prevState) {
  if (action.type === actionTypes.DRAKE_SUBMITTED &&
    (prevState.template && prevState.template === "ClutchGame") &&
    (prevState.challengeType && prevState.challengeType === "match-target")) {
      return prevState.submitted;
  } else {
    return selected || getSelected(action, prevState);
  }
}

function createLogEntry(loggingMetadata, action, prevState, nextState){
  let event = { ...action.meta.itsLog },
      context = { ...action },
      routeSpec = nextState.routeSpec;

  context.routeSpec = routeSpec;
  context.groupId = "Test-v3";
  context.challengeId = AuthoringUtils.getChallengeId(nextState.authoring, routeSpec);
  context.classId = loggingMetadata.classInfo;

  let challengeType = getChallengeType(prevState);
  if (challengeType) {
    context.challengeType = challengeType;
  }

  let selectableAttributes = getSelectableAttributes(nextState);
  if (selectableAttributes) {
    context.selectableAttributes = selectableAttributes;
  }

  let target = context.target || getTarget(prevState);
  if (target) {
    context.target = target;
  }

  let previous = getPrevious(context.selected, action, prevState);
  if (previous) {
    context.previous = previous;
  }

  let selected = context.selected || getSelected(action, nextState);
  if (selected) {
    context.selected = selected;
  }

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

  context = makeMutable(cloneDeep(context));

  let changeSexToString = sex => sex === 0 ? "male" : sex === 1 ? "female" : sex;
  changePropertyValues(context, "sex", changeSexToString);
  changePropertyValues(context, "newSex", changeSexToString);

  if (prevState.remediation) {
    context.remediation = true;
    context.challengeId = `${context.challengeId}-REMEDIATION`;
  }

  const message =
    {
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
