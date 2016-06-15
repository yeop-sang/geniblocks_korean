import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducers/reducer';
import { loadAuthoredChallenge } from './actions';

import ChallengeContainer from "./containers/challenge-container";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware from './middleware/its-log';
import io from 'socket.io-client';

const createStoreWithMiddleware = 
  applyMiddleware(loggerMiddleware, itsMiddleware(socket))(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const store = configureStore();

store.dispatch(loadAuthoredChallenge());

const socketEndpoint = "wss://guide.intellimedia.ncsu.edu";
const socketPath = {path: "/"};
const socket = "";//io(socketEndpoint, socketPath);
//socket.on('dialog', state =>
//  store.dispatch({type: 'SOCKET_RECEIVE', state})
//);

render(
  <Provider store={store}>
    <ChallengeContainer />
  </Provider>
, document.getElementById("gv"));


