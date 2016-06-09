import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';

import { createStore } from 'redux';

import reducer from './reducers/reducer';

import { initializeStateFromAuthoring, breed } from './actions';

import BreedingContainer from "./containers/breeding-container";


const store = createStore(reducer);

store.dispatch(initializeStateFromAuthoring());

const container = connect(
  function mapStateToProps (state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return {
      breed: (mother, father, offspringBin, quantity) => dispatch(breed(mother, father, offspringBin, quantity))
    };
  }
)(BreedingContainer);

const App = () => (
  <div>
    { React.createElement(container) }
  </div>
);

render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById("gv"));


