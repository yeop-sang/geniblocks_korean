import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore, routerMiddleware, push as pushHistory } from 'react-router-redux';

import reducer from './reducers/reducer';
import { actionTypes, startSession, loadAuthoredChallenge } from './actions';

import ChallengeContainer from "./containers/challenge-container";
import ModalMessageContainer from "./containers/modal-message-container";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware from './middleware/its-log';

import uuid from 'uuid';

// TODO: session ID and application name could be passed in via a container
// use placeholder ID for duration of session and hard-coded name for now.
const loggingMetadata = {
  applicationName: "GeniStarDev"
};

const socketEndpoint = "wss://guide.intellimedia.ncsu.edu";
const socketOpts = {path: "/", protocol: "tutor-actions-v1"};

const socket = new WebSocket(socketEndpoint, socketOpts.protocol);
socket.onopen = (state =>
  store.dispatch({type: actionTypes.SOCKET_CONNECTED, state})
  );
socket.onmessage = (state =>
  store.dispatch({type: actionTypes.SOCKET_RECEIVED, state})
);
socket.onerror = (state=>
  store.dispatch({type: actionTypes.SOCKET_ERRORED, state})
);

const hashHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const createStoreWithMiddleware =
  applyMiddleware(
    loggerMiddleware(loggingMetadata),
    itsMiddleware(socket, loggingMetadata),
    routerMiddleware(hashHistory)
  )(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const store = configureStore();

const history = syncHistoryWithStore(hashHistory, store);

store.dispatch(startSession(uuid.v4()));
store.dispatch(loadAuthoredChallenge());

store.dispatch(pushHistory("/1/1"));

render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/:case/:challenge" component={ChallengeContainer} />
      </Router>
      <ModalMessageContainer />
    </div>
  </Provider>
, document.getElementById("gv"));


