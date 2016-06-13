import React, { Component } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { chromosomeAlleleChange, sexChange } from '../actions';

class ChallengeContainer extends Component {
  render() {
    const Template = templates[this.props.template];
    return (
      <div>
        <Template {...this.props} />
      </div>
    );
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      drakes: state.drakes
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    chromosomeAlleleChange: (org, chrom, side, prevAllele, newAllele) => dispatch(chromosomeAlleleChange(org, chrom, side, prevAllele, newAllele)),
    sexChange: (index, newSex) => dispatch(sexChange(index, newSex))
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
