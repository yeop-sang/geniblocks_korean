import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducers/reducer';
import { loadAuthoredChallenge } from './actions';

import ChallengeContainer from "./containers/challenge-container";
import ModalMessageContainer from "./containers/modal-message-container";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware from './middleware/its-log';

import uuid from 'uuid';

// TODO: session ID and application name could be passed in via a container
// use placeholder ID for duration of session and hard-coded name for now.
const session = {
  id: uuid.v4(),
  applicationName: "GeniStar"
};

const socketEndpoint = "wss://guide.intellimedia.ncsu.edu";
const socketOpts = {path: "/", protocol: "tutor-actions-v1"};

const socket = new WebSocket(socketEndpoint, socketOpts.protocol);
socket.onopen = (state =>
  store.dispatch({type: 'SOCKET_CONNECT', state})
  );
socket.onmessage = (state =>
  store.dispatch({type: 'SOCKET_RECEIVE', state})
);
socket.onerror = (state=>
  store.dispatch({type: 'SOCKET_ERROR', state})
);

const createStoreWithMiddleware =
  applyMiddleware(loggerMiddleware(session), itsMiddleware(socket,session))(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const store = configureStore();

store.dispatch(loadAuthoredChallenge());

render(
  <Provider store={store}>
    <div>
      <ChallengeContainer />
      <ModalMessageContainer />
    </div>
  </Provider>
, document.getElementById("gv"));


