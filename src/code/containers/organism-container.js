import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import OrganismView from '../components/organism';

const APP = class OrganismContainer extends Component {

  render () {
    let orgDef = this.props.drakes[0],
        org = new BioLogica.Organism(BioLogica.Species.Drake, orgDef);

    return (
      <div>
        <OrganismView org={org} />
      </div>
    );
  }
};

export default connect(function(state) {
  return state;
})(APP);

// ;
