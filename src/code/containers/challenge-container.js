import React, { Component } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { chromosomeAlleleChange, sexChange, navigateNextChallenge } from '../actions';

class ChallengeContainer extends Component {
  render() {
    const Template = templates[this.props.template];
    return (
      <div id="challenges" className="case-backdrop">
        <div id="case-wrapper">
          <Template {...this.props} />
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      drakes: state.drakes,
      hiddenAlleles: state.hiddenAlleles.asMutable()
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    chromosomeAlleleChange: (org, chrom, side, prevAllele, newAllele) => dispatch(chromosomeAlleleChange(org, chrom, side, prevAllele, newAllele)),
    sexChange: (index, newSex) => dispatch(sexChange(index, newSex)),
    navigateNextChallenge: () => dispatch(navigateNextChallenge())
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
