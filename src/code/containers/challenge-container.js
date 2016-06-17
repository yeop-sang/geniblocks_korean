import React, { Component } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { chromosomeAlleleChange, sexChange, loadAuthoredChallenge } from '../actions';
import ModalAlert from '../components/modal-alert';

class ChallengeContainer extends Component {
  render() {
    // TODO: wire up incoming messages from ITS so show alerts
    let showAlert, message, leftButton = {}, rightButton = {}, challengeProgress = {};
    const modalDialogProperties = {
      message,
      leftButton,
      rightButton,
      challengeProgress
    };
    const Template = templates[this.props.template];
    return (
      <div id="challenges" className="case-backdrop">
        <div id="case-wrapper">
          <Template {...this.props} />
        </div>
        <ModalAlert
          show={showAlert} message={modalDialogProperties.message}
          leftButton={modalDialogProperties.leftButton} rightButton={modalDialogProperties.rightButton} challengeProgress={modalDialogProperties.challengeProgress}/>
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
