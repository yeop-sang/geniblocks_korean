import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { changeAllele, changeSex, submitDrake,
        keepOffspring, fertilize, hatch,
        changeBasketSelection, changeDrakeSelection, submitEggForBasket, showTutorial } from '../actions';
import { addGameteChromosome, resetGametes,
        addGametesToPool, selectGameteInPool, resetGametePools } from '../modules/gametes';

class ChallengeContainer extends Component {

  render() {
    if (!this.props.template) return null;

    const Template = templates[this.props.template];
    return (
      <div id="challenges" className="mission-backdrop">
        <div id="mission-wrapper">
          <Template {...this.props} />
        </div>
      </div>
    );
  }

  static propTypes = {
    template: PropTypes.string,
    routeSpec: PropTypes.object
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      challengeType: state.challengeType,
      interactionType: state.interactionType,
      instructions: state.instructions,
      showUserDrake: state.showUserDrake,
      drakes: state.drakes,
      gametes: state.gametes,
      userChangeableGenes: state.userChangeableGenes,
      visibleGenes: state.visibleGenes,
      hiddenAlleles: state.hiddenAlleles,
      hiddenParent: state.hiddenParent,
      baskets: state.baskets,
      trial: state.trial,
      trials: state.trials,
      routeSpec: state.routeSpec,
      correct: state.correct,
      errors: state.errors,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden,
      tutorials: state.tutorials
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele, incrementMoves=true) =>
      dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, incrementMoves)),
    onSexChange: (index, newSex, incrementMoves=true) =>
      dispatch(changeSex(index, newSex, incrementMoves)),
    onDrakeSubmission: (targetDrakeIndex, userDrakeIndex, correct, incorrectAction, motherIndex, fatherIndex) =>
      dispatch(submitDrake(targetDrakeIndex, userDrakeIndex, correct, incorrectAction, motherIndex, fatherIndex)),
    onGameteChromosomeAdded: (index, name, side) => dispatch(addGameteChromosome(index, name, side)),
    onAddGametesToPool: (index, gametes) => dispatch(addGametesToPool(index, gametes)),
    onSelectGameteInPool: (sex, index) => dispatch(selectGameteInPool(sex, index)),
    onFertilize: () => dispatch(fertilize()),
    onHatch: () => dispatch(hatch()),
    onResetGametes: () => dispatch(resetGametes()),
    onResetGametePools: () => dispatch(resetGametePools()),
    onKeepOffspring: (index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake) => dispatch(keepOffspring(index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake)),
    onChangeBasketSelection: (selectedIndices) => dispatch(changeBasketSelection(selectedIndices)),
    onChangeDrakeSelection: (selectedIndices) => dispatch(changeDrakeSelection(selectedIndices)),
    onSubmitEggForBasket: (...args) => dispatch(submitEggForBasket(...args)),
    onShowTutorial: () => dispatch(showTutorial())
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
