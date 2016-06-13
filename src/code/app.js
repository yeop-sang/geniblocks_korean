import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';

import { createStore } from 'redux';

import reducer from './reducers/reducer';

import { initializeStateFromAuthoring, chromosomeAlleleChange, sexChange } from './actions';

import GenomeContainer from "./containers/genome-container";


const store = createStore(reducer, null, window.devToolsExtension && window.devToolsExtension());

store.dispatch(initializeStateFromAuthoring());

const container = connect(
  function mapStateToProps (state) {
    return {
      drakes: state.drakes,
      index: [0, 0]
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onAlleleChange: (index, chrom, side, prevAllele, newAllele) => dispatch(chromosomeAlleleChange(index, chrom, side, prevAllele, newAllele)),
      onSexChange: (index, newSex) => dispatch(sexChange(index, newSex))
    };
  }
)(GenomeContainer);

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


