/* global firebase */
import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducers/';
import { startSession, changeAuthoring } from './actions';

import AuthoringUpload from './containers/authoring-upload';
import Navigation from "./containers/navigation";
import ChallengeContainerSelector from "./containers/challenge-container-selector";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware, { initializeITSSocket } from './middleware/its-log';
import routerMiddleware from './middleware/router-history';
import stateSaveMiddleware, {authoringVersionNumber} from './middleware/state-save';
import soundsMiddleware from 'redux-sounds';
import thunk from 'redux-thunk';

import GeneticsUtils from './utilities/genetics-utils';
import urlParams from './utilities/url-params';
import uuid from 'uuid';
import initFirebase from "./utilities/firebase-auth";

let authToken = initFirebase();

// trivial check for Windows as part of user agent string
if (navigator.userAgent.indexOf('Windows') >= 0)
  document.body.className += ' os-windows';

function convertAuthoring(authoring) {
  return GeneticsUtils.convertDashAllelesObjectToABAlleles(authoring,
                          ["alleles", "baseDrake","initialDrakeCombos", "targetDrakeCombos"]);
}

// TODO: session ID and application name could be passed in via a container
// use placeholder ID for duration of session and hard-coded name for now.
let loggingMetadata = {
  applicationName: "GeniStarDev"
};

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
    itsMiddleware(loggingMetadata),
    routerMiddleware(hashHistory),
    stateSaveMiddleware(),
    loadedSoundsMiddleware
  )(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const store = configureStore();

const guideServer = "wss://guide.intellimedia.ncsu.edu",
      guideProtocol  = "guide-protocol-v3";
initializeITSSocket(guideServer, guideProtocol, store);

// generate pseudo-random sessionID and username
const sessionID = uuid.v4(),
      userNameBase = authToken.claims.user_id || "gv2-user";
loggingMetadata.userName = `${userNameBase}-${sessionID.split("-")[0]}`;
loggingMetadata.classInfo = authToken.class_info_url;
loggingMetadata.studentId = urlParams.domain_uid;
loggingMetadata.externalId = authToken.externalId;
loggingMetadata.returnUrl = urlParams.domain;
// start the session before syncing history, which triggers navigation
store.dispatch(startSession(sessionID));

const history = syncHistoryWithStore(hashHistory, store);

const isAuthorUploadRequested = (urlParams.author === "upload");
let isAuthorUploadEnabled = isAuthorUploadRequested;  // e.g. check PRODUCTION flag

function loadAuthoring() {
  const localAuthoring = urlParams.localAuthoring || false;
  if (localAuthoring) {
    const url = `resources/authoring/${localAuthoring}.json`;
    fetch(url)
      .then(response => response.json())
      .then(handleAuthoringLoad, () => alert(`Cannot load ${url}`));
  } else {
    const db = firebase.database(),
          ref = db.ref(authoringVersionNumber + "/authoring");

    ref.once("value", function(authoringData) {
      handleAuthoringLoad(authoringData.val());
    });
  }
}

function handleCompleteUpload(authoring) {
  store.dispatch(changeAuthoring(convertAuthoring(authoring)));
  isAuthorUploadEnabled = false;
  renderApp();
}

function handleAuthoringLoad(authoring) {
  let convertedAuthoring = convertAuthoring(authoring);
  window.GV2Authoring = convertedAuthoring;
  store.dispatch(changeAuthoring(convertedAuthoring));
  renderApp();
}

function renderApp() {
  const content = isAuthorUploadEnabled
                    ? <AuthoringUpload isEnabled={isAuthorUploadEnabled}
                                        onCompleteUpload={handleCompleteUpload} />
                    : <div>
                        <Router history={history}>
                          <Route path="/navigation" component={Navigation} />
                          <Route path="/(:level/:mission/:challenge)" component={ChallengeContainerSelector} />
                          <Route path="/(:challengeId)" component={ChallengeContainerSelector} />
                        </Router>
                      </div>;
  render(
    <Provider store={store}>
      {content}
    </Provider>
  , document.getElementById("gv"));
}

loadAuthoring();
