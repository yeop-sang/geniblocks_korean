import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducers/';
import { actionTypes, startSession, changeAuthoring } from './actions';

import AuthoringUpload from './containers/authoring-upload';
import ChallengeContainer from "./containers/challenge-container";
import ModalMessageContainer from "./containers/modal-message-container";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware from './middleware/its-log';
import routerMiddleware from './middleware/router-history';
import soundsMiddleware from 'redux-sounds';
import thunk from 'redux-thunk';

import io from 'socket.io-client';
import GeneticsUtils from './utilities/genetics-utils';
import urlParams from './utilities/url-params';
import uuid from 'uuid';

const authoring = require('../resources/authoring/gv2.json'),
      converted = GeneticsUtils.convertDashAllelesObjectToABAlleles(authoring,
                                    ["alleles", "baseDrake","initialDrakeCombos", "targetDrakeCombos"]);
window.GV2Authoring = converted;

// TODO: session ID and application name could be passed in via a container
// use placeholder ID for duration of session and hard-coded name for now.
const loggingMetadata = {
  applicationName: "GeniStarDev"
};

const socketEndpoint = "wss://guide.intellimedia.ncsu.edu";

const socket = io(socketEndpoint, {reconnection: false});
socket.on('connection', state =>
  store.dispatch({type: actionTypes.SOCKET_CONNECTED, state})
);
socket.on('message', state =>
  store.dispatch({type: actionTypes.SOCKET_RECEIVED, state})
);
socket.on('error', state=>
  store.dispatch({type: actionTypes.SOCKET_ERRORED, state})
);

const hashHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const soundsData = {
  hatchDrake: "resources/audio/BabyDragon.mp3",
  receiveCoin: "resources/audio/coin.mp3"
};
// Pre-load middleware with our sounds.
const loadedSoundsMiddleware = soundsMiddleware(soundsData);

const createStoreWithMiddleware =
  applyMiddleware(
    thunk,
    loggerMiddleware(loggingMetadata),
    itsMiddleware(socket, loggingMetadata),
    routerMiddleware(hashHistory),
    loadedSoundsMiddleware
  )(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const store = configureStore();

const history = syncHistoryWithStore(hashHistory, store);

store.dispatch(startSession(uuid.v4()));

const isAuthorUploadRequested = (urlParams.author === "upload");
let isAuthorUploadEnabled = isAuthorUploadRequested;  // e.g. check PRODUCTION flag

function handleCompleteUpload(authoring) {
  store.dispatch(changeAuthoring(authoring));
  isAuthorUploadEnabled = false;
  renderApp();
}

function renderApp() {
  const content = isAuthorUploadEnabled
                    ? <AuthoringUpload isEnabled={isAuthorUploadEnabled}
                                        onCompleteUpload={handleCompleteUpload} />
                    : <div>
                        <Router history={history}>
                          <Route path="/(:case/:challenge)" component={ChallengeContainer} />
                        </Router>
                        <ModalMessageContainer />
                      </div>;
  render(
    <Provider store={store}>
      {content}
    </Provider>
  , document.getElementById("gv"));
}

renderApp();
