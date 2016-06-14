import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { createStore } from 'redux';

import reducer from './reducers/reducer';

import { loadAuthoredChallenge } from './actions';

import ChallengeContainer from "./containers/challenge-container";


const store = createStore(reducer, null, window.devToolsExtension && window.devToolsExtension());

store.dispatch(loadAuthoredChallenge());

render(
  <Provider store={store}>
    <ChallengeContainer />
  </Provider>
, document.getElementById("gv"));


