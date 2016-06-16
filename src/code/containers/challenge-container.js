import React, { Component } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { chromosomeAlleleChange, sexChange, loadAuthoredChallenge } from '../actions';

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
      hiddenAlleles: state.hiddenAlleles.asMutable(),
      trial: state.trial,
      moves: state.moves,
      goalMoves: state.goalMoves
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    chromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele) => dispatch(chromosomeAlleleChange(index, chrom, side, prevAllele, newAllele, true)),
    sexChange: (index, newSex) => dispatch(sexChange(index, newSex, true)),
    navigateNextChallenge: () => dispatch(loadAuthoredChallenge(0,1)) // hard-coded for the moment
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
