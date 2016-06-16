import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducers/reducer';
import { loadAuthoredChallenge } from './actions';

import ChallengeContainer from "./containers/challenge-container";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware from './middleware/its-log';

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
  applyMiddleware(loggerMiddleware, itsMiddleware(socket))(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const store = configureStore();

store.dispatch(loadAuthoredChallenge());

render(
  <Provider store={store}>
    <ChallengeContainer />
  </Provider>
, document.getElementById("gv"));


