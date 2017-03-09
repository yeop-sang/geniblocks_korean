import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dimensions from 'react-dimensions';
import classNames from 'classnames';
import templates from '../templates';
import { changeAllele, changeSex, submitDrake, navigateToNextChallenge,
        keepOffspring, fertilize, hatch, completeChallenge,
        changeBasketSelection, changeDrakeSelection, submitEggForBasket } from '../actions';
import { addGameteChromosome, resetGametes,
        addGametesToPool, selectGameteInPool, resetGametePools } from '../modules/gametes';

const bgImageWidth = 1920,
      bgImageHeight = 1080,
      bgLinesHeight = 79,
      minContainerWidth = 1200,
      minContainerHeight = 700,
      topHudHeight = 152,
      bottomHudHeight = 145;

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
    const { template, containerWidth, containerHeight, ...otherProps } = this.props;

    if (!template) return null;

    const Template = templates[this.props.template],
          bgClasses = Template.backgroundClasses,
          scaleFactor = calcScaleFactor(containerWidth, containerHeight),
          scaledLinesHeight = scaleFactor * bgLinesHeight,
          scaledTopHudHeight = scaleFactor * topHudHeight,
          scaledImageWidth = scaleFactor * bgImageWidth,
          scaledImageHeight = scaleFactor * bgImageHeight,
          scaledBottomHudHeight = scaleFactor * bottomHudHeight,
          challengeHeight = scaledImageHeight - (scaledTopHudHeight + scaledBottomHudHeight),
          style = scaleFactor !== 1.0
                    ? { height: scaledImageHeight,
                        backgroundSize: `auto ${scaledLinesHeight}px, auto ${scaledLinesHeight}px, contain` }
                    : {};
    return (
      <div id="challenges" className={classNames('mission-backdrop', bgClasses)}
            style={style} >
        <div id='fv-top-hud' className='fv-hud'
              style={{height: scaledTopHudHeight,
                      backgroundSize: `${scaledImageWidth}px ${scaledTopHudHeight}px`}}></div>
        <div id="mission-wrapper" style={{height: challengeHeight}}>
          <Template {...otherProps} />
        </div>
        <div id='fv-bottom-hud' className='fv-hud'
              style={{height: scaledBottomHudHeight,
                      backgroundSize: `${scaledImageWidth}px ${scaledBottomHudHeight}px`}}></div>
      </div>
    );
  }

  static propTypes = {
    template: PropTypes.string,
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
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
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele) => dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, true)),
    onSexChange: (index, newSex) => dispatch(changeSex(index, newSex, true)),
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
