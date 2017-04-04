import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dimensions from 'react-dimensions';
import classNames from 'classnames';
import templates from '../templates';
import BottomHUDView from '../fv-components/bottom-hud';
import TopHUDView from '../fv-components/top-hud';
import { changeAllele, changeSex, submitDrake, navigateToNextChallenge,
        keepOffspring, fertilize, hatch, completeChallenge,
        changeBasketSelection, changeDrakeSelection, submitEggForBasket } from '../actions';
import { addGameteChromosome, resetGametes,
        addGametesToPool, selectGameteInPool, resetGametePools } from '../modules/gametes';

const bgImageWidth = 1920,
      bgImageHeight = 1080,
      minContainerWidth = 1200,
      minContainerHeight = 700;

function calcScaleFactor(containerWidth, containerHeight) {
  // if there's enough room, then no scaling required (we don't scale up)
  if ((containerWidth >= bgImageWidth) &&
      (containerHeight >= bgImageHeight)) {
    return 1.0;
  }
  // if scaling is required, figure out the controlling dimension
  const effectiveContainerWidth = Math.max(containerWidth, minContainerWidth),
        effectiveContainerHeight = Math.max(containerHeight, minContainerHeight),
        containerAspect = effectiveContainerWidth / effectiveContainerHeight,
        bgImageAspect = bgImageWidth / bgImageHeight;

  // width is the constraining dimension
  return containerAspect <= bgImageAspect
            ? effectiveContainerWidth / bgImageWidth     // width is constraining dimension
            : effectiveContainerHeight / bgImageHeight;  // height is constraining dimension
}

class FVChallengeContainer extends Component {

  render() {
    const { template, containerWidth, containerHeight, ...otherProps } = this.props,
          { challengeType, interactionType, routeSpec, trial, trials, correct } = this.props;

    if (!template) return null;

    const Template = templates[this.props.template],
          bgClasses = classNames('mission-backdrop', Template.backgroundClasses,
                                  challengeType, interactionType),
          scaleFactor = calcScaleFactor(containerWidth, containerHeight),
          scaleFactorStyle = { transform: `scale(${scaleFactor})`},
          maxScore = Template.maxScore;

    return (
      <div id="challenges" className={bgClasses} style={scaleFactorStyle}>
        // TODO: put location names in the authoring document
        <TopHUDView location={"Hatchery"} />
        <div id="mission-wrapper">
          <Template scale={scaleFactor} {...otherProps} />
        </div>
        <BottomHUDView level={routeSpec.level + 1} trial={trial + 1} trialCount={trials ? trials.length : 1} 
                       currScore={correct} maxScore={maxScore}/>
      </div>
    );
  }

  static propTypes = {
    template: PropTypes.string,
    challengeType: PropTypes.string,
    interactionType: PropTypes.string,
    trial: PropTypes.number,
    trials: PropTypes.array,
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    routeSpec: PropTypes.object,
    correct: PropTypes.number
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
      baskets: state.baskets,
      trial: state.trial,
      trials: state.trials,
      routeSpec: state.routeSpec,
      correct: state.correct,
      errors: state.errors,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele, incrementMoves=true) =>
      dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, incrementMoves)),
    onSexChange: (index, newSex, incrementMoves=true) =>
      dispatch(changeSex(index, newSex, incrementMoves)),
    onDrakeSubmission: (targetDrakeIndex, userDrakeIndex, correct, incorrectAction) =>
      dispatch(submitDrake(targetDrakeIndex, userDrakeIndex, correct, incorrectAction)),
    onNavigateNextChallenge: () => dispatch(navigateToNextChallenge()),
    onCompleteChallenge: () => dispatch(completeChallenge()),
    onGameteChromosomeAdded: (index, name, side) => dispatch(addGameteChromosome(index, name, side)),
    onAddGametesToPool: (index, gametes) => dispatch(addGametesToPool(index, gametes)),
    onSelectGameteInPool: (sex, index) => dispatch(selectGameteInPool(sex, index)),
    onFertilize: (gamete1, gamete2) => dispatch(fertilize(gamete1, gamete2)),
    onHatch: () => dispatch(hatch()),
    onResetGametes: () => dispatch(resetGametes()),
    onResetGametePools: () => dispatch(resetGametePools()),
    onKeepOffspring: (index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake) => dispatch(keepOffspring(index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake)),
    onChangeBasketSelection: (selectedIndices) => dispatch(changeBasketSelection(selectedIndices)),
    onChangeDrakeSelection: (selectedIndices) => dispatch(changeDrakeSelection(selectedIndices)),
    onSubmitEggForBasket: (...args) => dispatch(submitEggForBasket(...args))
  };
}

const FVChallenge = connect(mapStateToProps, mapDispatchToProps)(FVChallengeContainer);

const containerStyle = { width: '100vw', height: '100vh' };
export default Dimensions({ className: 'challenge-container', containerStyle })(FVChallenge);
