import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { createStore } from 'redux';

import reducer from './reducers/reducer';

import OrganismContainer from "./containers/organism-container";


const store = createStore(reducer);


render(
  <Provider store={store}>
    <OrganismContainer />
  </Provider>
  , document.getElementById("gv"));


