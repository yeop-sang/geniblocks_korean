import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import AnimatedComponentView from '../components/animated-component';
import BasketSetView from '../components/basket-set';
import EggClutchView, { EGG_IMAGE_WIDTH } from '../components/egg-clutch';
import EggHatchView from '../components/egg-hatch';
import GenomeView from '../components/genome';
import urlParams from '../utilities/url-params';
import t from '../utilities/translate';

const EGG_IMAGE_WIDTH_MEDIUM = EGG_IMAGE_WIDTH * 2 / 3,
      EGG_IMAGE_WIDTH_SMALL = EGG_IMAGE_WIDTH / 3,

      DRAKE_INDEX_OF_FIRST_EGG = 3,

      modeHatchInPlace = urlParams.hatchInPlace > 0,
      modeHatchInBasket = !modeHatchInPlace,
      modeCollectInBasket = urlParams.collectInBasket > 0,
      modeFadeAway = !modeCollectInBasket;

let basketsBounds = [],
    eggsBounds = [];

let _this,
    animatedComponents = [],
    animatedComponentToRender,
    lastAnimatedComponentId = 0,
    animationTimeline = {},

    isSubmittedEggCorrect,
    animatingEgg, animatingEggIndex,
    animatingDrake,
    startBounds, targetBounds, finalBounds,
    startSize, targetSize, finalSize,
    layout;

function animationLayout(eggIndex, basketIndex) {
  startBounds = Object.assign({}, eggsBounds[eggIndex]);
  startSize = EGG_IMAGE_WIDTH;

  if (modeHatchInPlace && modeCollectInBasket) {
    targetBounds = Object.assign({}, startBounds);
    targetSize = startSize;
    finalBounds = Object.assign({}, basketsBounds[basketIndex]);
    if (isSubmittedEggCorrect) {
      finalBounds.left += 52;
      finalBounds.top += 10;
      finalSize = EGG_IMAGE_WIDTH_SMALL;
    }
    else {
      finalSize = targetSize;
    }
  }
  else if (modeHatchInBasket && modeCollectInBasket) {
    targetBounds = Object.assign({}, basketsBounds[basketIndex]);
    targetBounds.left += 42;
    targetBounds.top -= 80;
    targetSize = EGG_IMAGE_WIDTH_MEDIUM,
    finalBounds = Object.assign({}, targetBounds);
    if (isSubmittedEggCorrect) {
      finalBounds.left += 10;
      finalBounds.top += 90;
      finalSize = EGG_IMAGE_WIDTH_SMALL;
    }
    else {
      finalSize = targetSize;
    }
  }
  else if (modeHatchInPlace && modeFadeAway) {
    targetBounds = Object.assign({}, startBounds);
    targetSize = startSize;
    finalBounds = Object.assign({}, basketsBounds[basketIndex]);
    if (isSubmittedEggCorrect) {
      finalBounds.left += 52;
      finalBounds.top += 10;
      finalSize = EGG_IMAGE_WIDTH_SMALL;
    }
    else {
      finalSize = targetSize;
    }
  }
  else /* (modeHatchInBasket && modeFadeAway) */ {
    targetBounds = Object.assign({}, basketsBounds[basketIndex]);
    targetBounds.left += 42;
    targetBounds.top -= 30;
    targetSize = EGG_IMAGE_WIDTH_MEDIUM,
    finalBounds = Object.assign({}, targetBounds);
    if (isSubmittedEggCorrect) {
      finalBounds.top += 40;
    }
    else {
      finalBounds.top -= 40;
    }
    finalSize = targetSize;
  }

  return { startBounds, startSize, targetBounds, targetSize, finalBounds, finalSize };
}

let animationEvents = {
      moveEggToBasket: { id: 0, complete: false, animate: function(egg, eggIndex, basketIndex) {
        // kill any earlier animations still running
        resetAnimationEvents(true);

        layout = animationLayout(eggIndex, basketIndex);

        if (layout.startBounds && layout.targetBounds) {
          animatingEgg = egg;
          animatingEggIndex = eggIndex;
          animatingDrake = new BioLogica.Organism(BioLogica.Species.Drake, egg.alleles, egg.sex);

          animatedComponentToRender = <EggHatchView egg={animatingEgg} organism={animatingDrake} />;
          runAnimation(animationEvents.moveEggToBasket.id,
                        { bounds: layout.startBounds, size: layout.startSize, hatchProgress: 0 },
                        { bounds: layout.targetBounds, size: layout.targetSize, hatchProgress: 0 });
        }

        _this.setState({animation:"moveEggToBasket"});
      }},
      hatchDrakeInBasket: { id: 1, complete: false, animate: function() {
        animatedComponentToRender = <EggHatchView egg={animatingEgg} organism={animatingDrake} glow={true}/>;
        runAnimation(animationEvents.hatchDrakeInBasket.id,
                        { bounds: layout.targetBounds, size: layout.targetSize, hatchProgress: 0 },
                        { bounds: layout.targetBounds, size: layout.targetSize, hatchProgress: 1 });
        _this.setState({animation:"hatchDrakeInBasket"});
      }},
      fadeDrakeAway: { id: 2, complete: false, animate: function() {
        let startBounds = modeHatchInPlace ? layout.startBounds : layout.targetBounds,
            startSize = modeHatchInPlace ? layout.startSize : layout.targetSize;
        _this.clearSelection();
        resetAnimationEvents(false);
        animatedComponentToRender = <EggHatchView egg={animatingEgg} organism={animatingDrake} glow={true}/>;
        runAnimation(animationEvents.fadeDrakeAway.id,
                        { bounds: startBounds, size: startSize, opacity: 1, hatchProgress: 1 },
                        { bounds: layout.finalBounds, size: layout.finalSize, opacity: 0, hatchProgress: 1 },
                        "slow");
        _this.setState({animation:"fadeDrakeAway"});
      }},
      settleEggInBasket: { id: 3, complete: false, animate: function() {
        _this.clearSelection();
        resetAnimationEvents(false);
        animatedComponentToRender = <EggHatchView egg={animatingEgg} organism={animatingDrake} />;
        runAnimation(animationEvents.settleEggInBasket.id,
                        { bounds: layout.targetBounds, size: layout.targetSize, hatchProgress: 1 },
                        { bounds: layout.finalBounds, size: layout.finalSize, hatchProgress: 0 });
        _this.setState({animation:"settleEggInBasket"});
      }},
      returnEggFromBasket: { id: 4, complete: false, animate: function() {
        resetAnimationEvents(false);
        animatedComponentToRender = <EggHatchView egg={animatingEgg} organism={animatingDrake} />;
        runAnimation(animationEvents.returnEggFromBasket.id,
                        { bounds: layout.targetBounds, size: layout.targetSize, hatchProgress: 1 },
                        { bounds: layout.startBounds, size: layout.startSize, hatchProgress: 0 });
        _this.setState({animation:"returnEggFromBasket"});
      }},
      hatchDrakeInEgg: { id: 5, complete: false, animate: function(egg, eggIndex, basketIndex) {
        layout = animationLayout(eggIndex, basketIndex);

        if (layout.startBounds && layout.targetBounds) {
          animatingEgg = egg;
          animatingEggIndex = eggIndex;
          animatingDrake = new BioLogica.Organism(BioLogica.Species.Drake, egg.alleles, egg.sex);

          animatedComponentToRender = <EggHatchView egg={animatingEgg} organism={animatingDrake} glow={true}/>;
          runAnimation(animationEvents.hatchDrakeInEgg.id,
                        { bounds: layout.startBounds, size: layout.startSize, hatchProgress: 0 },
                        { bounds: layout.startBounds, size: layout.startSize, hatchProgress: 1 });
        }
        _this.setState({animation:"hatchDrakeInEgg"});
      }},
    };

function resetAnimationEvents(clearEggSequence) {
  animatedComponents = [];
  if (clearEggSequence) {
    animatingEgg = null;
    animatingEggIndex = null;
    animatingDrake = null;
  }
}

function runAnimation(animationEvent, start, target, speed = "fast") {
  let { bounds: startPositionRect, ...startDisplay } = start,
      { bounds: targetPositionRect, ...targetDisplay } = target;
  startDisplay.startPositionRect = startPositionRect;
  targetDisplay.targetPositionRect = targetPositionRect;

  let animationSpeed = speed;
  animationTimeline[lastAnimatedComponentId] = animationEvent;
  animatedComponents.push(
    <AnimatedComponentView key={lastAnimatedComponentId}
      animEvent={animationEvent}
      speed={animationSpeed}
      viewObject={animatedComponentToRender}
      startDisplay={startDisplay}
      targetDisplay={targetDisplay}
      runAnimation={true}
      onRest={animationFinish} />);
  lastAnimatedComponentId++;
}

function animationFinish(evt) {
  switch(evt) {
    case animationEvents.moveEggToBasket.id:
      animationEvents.moveEggToBasket.complete = true;
      resetAnimationEvents(false);
      animationEvents.hatchDrakeInBasket.animate(animatingEgg);
      break;
    case animationEvents.hatchDrakeInBasket.id:
      animationEvents.hatchDrakeInBasket.complete = true;
      break;
    case animationEvents.fadeDrakeAway.id:
      animationEvents.fadeDrakeAway.complete = true;
      resetAnimationEvents(true);
      break;
    case animationEvents.settleEggInBasket.id:
      animationEvents.settleEggInBasket.complete = true;
      resetAnimationEvents(true);
      break;
    case animationEvents.returnEggFromBasket.id:
      animationEvents.returnEggFromBasket.complete = true;
      resetAnimationEvents(true);
      break;
    case animationEvents.hatchDrakeInEgg.id:
      animationEvents.hatchDrakeInEgg.complete = true;
      break;
  }
  _this.setState({animation:"complete"});
}

function isEggCompatibleWithBasket(egg, basket) {
  if (!egg || !basket) return false;
  if ((basket.sex != null) && (egg.sex !== basket.sex))
    return false;
  // one of the basket's allele strings...
  return basket.alleles.some((alleleString) => {
    // ... must match every one of its alleles ...
    return alleleString.split(',').every((allele) => {
      // ... to the alleles of the egg
      return egg.alleles.indexOf(allele) >= 0;
    });
  });
}

export default class EggSortGame extends Component {

  static propTypes = {
    case: PropTypes.number.isRequired,
    challenge: PropTypes.number.isRequired,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    baskets: PropTypes.array.isRequired,
    correct: PropTypes.number,
    errors: PropTypes.number,
    onChangeBasketSelection: PropTypes.func,
    onChangeDrakeSelection: PropTypes.func,
    onSubmitEggForBasket: PropTypes.func.isRequired
  }

  state = {
    animation: null,
    eggs: []
  }

  componentWillMount() {
    const { drakes } = this.props,
          eggs = drakes.slice(DRAKE_INDEX_OF_FIRST_EGG).map((child) =>
                    new BioLogica.Organism(BioLogica.Species.Drake, child.alleleString, child.sex));
    this.setState({ eggs });
  }

  componentWillReceiveProps(nextProps) {
    const { case: prevCase, challenge: prevChallenge, trial: prevTrial,
            correct: prevCorrect, errors: prevErrors } = this.props,
          { case: nextCase, challenge: nextChallenge, trial: nextTrial,
            correct: nextCorrect, errors: nextErrors } = nextProps;
    if ((prevCase !== nextCase) || (prevChallenge !== nextChallenge) || (prevTrial !== nextTrial)) {
      resetAnimationEvents(true);
      this.clearSelection();
    }
    else {
      if (prevCorrect !== nextCorrect) {
        if (modeFadeAway)
          animationEvents.fadeDrakeAway.animate();
        else
          animationEvents.settleEggInBasket.animate();
      }
      if (prevErrors !== nextErrors) {
        animationEvents.fadeDrakeAway.animate();
      }
    }
  }

  selectedEgg() {
    const { drakes } = this.props,
          { eggs } = this.state,
          eggDrakeIndex = drakes.findIndex((drake) => drake && drake.isSelected),
          eggIndex = eggDrakeIndex >= DRAKE_INDEX_OF_FIRST_EGG
                      ? eggDrakeIndex - DRAKE_INDEX_OF_FIRST_EGG
                      : null,
          egg = eggIndex != null && eggIndex >= 0 ? eggs[eggIndex] : null;
    return { index: eggIndex, egg };
  }

  selectedBaskets() {
    const { baskets } = this.props;
    return baskets.reduce((prev, basket, index) => {
                      if (basket && basket.isSelected)
                        prev.push(index);
                      return prev;
                    }, []);
  }

  clearSelection() {
    this.setBasketSelection([]);
    this.setEggSelection([]);
  }

  setBasketSelection(selectedIndices) {
    const { onChangeBasketSelection } = this.props,
          currSelectedIndices = this.selectedBaskets();
    if (!_.isEqual(selectedIndices, currSelectedIndices))
      onChangeBasketSelection(selectedIndices);
  }

  selectAllBaskets() {
    const { baskets } = this.props,
          allBaskets = baskets.map((basket, index) => index);
    this.setBasketSelection(allBaskets);
  }

  setEggSelection(selectedIndices) {
    const { onChangeDrakeSelection } = this.props,
          { index: currSelectedIndex } = this.selectedEgg(),
          currSelectedIndices = currSelectedIndex != null ? [currSelectedIndex + DRAKE_INDEX_OF_FIRST_EGG] : [];
    if (!_.isEqual(selectedIndices, currSelectedIndices))
      onChangeDrakeSelection(selectedIndices);
  }

  handleUpdateBasketBounds = (basket, index, bounds) => {
    const { left, top, width, height } = bounds;
    basketsBounds[index] = { left, top, width, height };
  }

  handleUpdateEggBounds = (egg, index, bounds) => {
    const { left, top, width, height } = bounds;
    eggsBounds[index] = { left, top, width, height };
  }

  handleBackgroundClick = () => {
    this.clearSelection();
  }

  handleBasketClick = (id, basketIndex, basket) => {
    const { correct, errors, onSubmitEggForBasket } = this.props,
          { eggs } = this.state,
          { index: selectedEggIndex, egg: selectedEgg } = this.selectedEgg(),
          eggDrakeIndex = selectedEggIndex + DRAKE_INDEX_OF_FIRST_EGG,
          isChallengeComplete = correct + errors + 1 >= eggs.length;
    isSubmittedEggCorrect = selectedEgg && isEggCompatibleWithBasket(selectedEgg, basket);
    if (selectedEgg) {
      if (modeHatchInPlace)
        animationEvents.hatchDrakeInEgg.animate(selectedEgg, selectedEggIndex, basketIndex);
      else
        animationEvents.moveEggToBasket.animate(selectedEgg, selectedEggIndex, basketIndex);
      onSubmitEggForBasket(eggDrakeIndex, basketIndex, isSubmittedEggCorrect, isChallengeComplete);
    }
    this.setBasketSelection([basketIndex]);
  }

  handleEggClick = (id, index) => {
    this.setEggSelection([index + DRAKE_INDEX_OF_FIRST_EGG]);
    this.selectAllBaskets();
  }

  render() {
    const { hiddenAlleles, drakes, baskets, correct, errors } = this.props,
          { animation, eggs } = this.state,
          selectedBaskets = this.selectedBaskets(),
          { index: selectedEggIndex, egg: selectedEgg } = this.selectedEgg(),
          animatingEggDrakeIndex = (animatingEggIndex != null)
                                    ? animatingEggIndex + DRAKE_INDEX_OF_FIRST_EGG
                                    : null,
          isHatchingDrakeInEgg = (animation === "hatchDrakeInEgg") ||
                                  ((animation === "complete") && (animatingEggIndex != null)),
          showSelectedEggIndex = isHatchingDrakeInEgg ? -1 : selectedEggIndex,
          basketEggs = modeCollectInBasket ? eggs : null,
          displayEggs = eggs.map((egg, index) => {
            const isAnimatingEgg = (animatingEggIndex === index) && !modeHatchInPlace,
                  drake = drakes[index + DRAKE_INDEX_OF_FIRST_EGG],
                  isEggInBasket = drake && (drake.basket != null);
            return isAnimatingEgg || isEggInBasket ? null : egg;
          }),
          showInstructions = !selectedEgg && !correct && !errors,
          sectionTitle = showInstructions
                            ? t('~EGG_GAME_3.INSTRUCTIONS_TITLE')
                            : t('~EGG_GAME_3.CHROMOSOMES_TITLE'),
          sectionTitleClasses = 'section-title unselectable' + (showInstructions ? ' instructions' : ' chromosomes'),
          instructionsView = !correct && !errors
                                ? <div>
                                    <div className='instr-heading unselectable'>{t("~EGG_GAME_3.INSTR_HEADING")}</div>
                                    <ul>
                                      <li className='instr-item'>{t("~EGG_GAME_3.INSTR_ITEM1")}</li>
                                      <li className='instr-item'>{t("~EGG_GAME_3.INSTR_ITEM2")}</li>
                                    </ul>
                                  </div>
                                : null,
          genomeView = selectedEgg
                        ? <GenomeView org={selectedEgg} hiddenAlleles={hiddenAlleles} editable={false} />
                        : null,
          genomeOrInstructionsView = selectedEgg ? genomeView : instructionsView,
          disableSelection = (['moveEggToBasket', 'hatchDrakeInBasket', 'hatchDrakeInEgg']
                                          .indexOf(animation) >= 0) ||
                              ((animation === 'complete') && (animatedComponents.length > 0));

    return (
      <div id="egg-sort-game" onClick={this.handleBackgroundClick}>
        <div id="left-section">
          <div id="baskets">
            <BasketSetView baskets={baskets} selectedIndices={selectedBaskets}
                            eggs={basketEggs} eggIndexOffset={DRAKE_INDEX_OF_FIRST_EGG}
                            animatingEggIndex={animatingEggDrakeIndex}
                            onUpdateBounds={this.handleUpdateBasketBounds}
                            onClick={disableSelection ? null : this.handleBasketClick}/>
          </div>
          <div id="eggs">
            <EggClutchView eggs={displayEggs} selectedIndex={showSelectedEggIndex}
                            onUpdateBounds={this.handleUpdateEggBounds}
                            onClick={disableSelection ? null : this.handleEggClick} />
          </div>
        </div>
        <div id="right-section">
          <div id="container">
            <div id="background"></div>
            <div className={sectionTitleClasses}>{sectionTitle}</div>
            {genomeOrInstructionsView}
          </div>
        </div>
        {animatedComponents}
      </div>
    );
  }

  componentDidUpdate() {
    _this = this;
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge) {

    const mother = new BioLogica.Organism(BioLogica.Species.Drake,
                                          authoredChallenge.mother.alleles,
                                          authoredChallenge.mother.sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake,
                                          authoredChallenge.father.alleles,
                                          authoredChallenge.father.sex),
          // authored specs may be incomplete; these are complete specs
          motherSpec = { alleles: mother.getAlleleString(), sex: mother.sex },
          fatherSpec = { alleles: father.getAlleleString(), sex: father.sex };
    let drakes = [motherSpec, fatherSpec, null];
    for (let i = 0; i < authoredChallenge.eggCount; ++i) {
      const child = BioLogica.breed(mother, father),
            alleles = child.getAlleleString(),
            sex = child.sex;
      drakes.push({ alleles, sex });
    }
    return drakes;
  }

}
