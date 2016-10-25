import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import compose from 'recompose/compose';
import renameProp from 'recompose/renameProp';
import animateSpring from '../hoc/animate-spring';
import initialElementId from '../hoc/initial-element-id';
import targetElementId from '../hoc/target-element-id';
import updateOnResizeScroll from '../hoc/update-on-resize-scroll';
import BasketSetView from '../components/basket-set';
import EggClutchView, { EGG_IMAGE_WIDTH } from '../components/egg-clutch';
import EggHatchView from '../components/egg-hatch';
import GenomeView from '../components/genome';
import { generateTrialDrakes } from '../utilities/trial-generator';
import urlParams from '../utilities/url-params';
import t from '../utilities/translate';

const EGG_IMAGE_WIDTH_MEDIUM = EGG_IMAGE_WIDTH * 2 / 3,
      EGG_IMAGE_WIDTH_SMALL = EGG_IMAGE_WIDTH / 3,

      MEDIUM_EGG_ON_BASKET_X_OFFSET = 42,
      MEDIUM_EGG_ON_BASKET_Y_OFFSET = -30,
      MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET = -80,
      MEDIUM_EGG_BELOW_BASKET_Y_OFFSET = 20,

      SMALL_EGG_ON_BASKET_X_OFFSET = 52,
      SMALL_EGG_ON_BASKET_Y_OFFSET = 10,

      modeCollectInBasket = urlParams.collectInBasket > 0,
      modeFadeAway = !modeCollectInBasket;

let _this,
    lastAnimatedComponentId = 0,

    isSubmittedEggCorrect,
    animatingEgg, animatingEggIndex,
    animatingDrake, targetBasketIndex;

const FastEggHatch = compose(
                        updateOnResizeScroll,
                        initialElementId(),
                        targetElementId(),
                        animateSpring(),
                        // animateSpring() generates 'style', but EggHatchView expects 'displayStyle'
                        renameProp('style', 'displayStyle'))(EggHatchView),
      SlowEggHatch = compose(
                        updateOnResizeScroll,
                        initialElementId(),
                        targetElementId(),
                        animateSpring(60),
                        // animateSpring() generates 'style', but EggHatchView expects 'displayStyle'
                        renameProp('style', 'displayStyle'))(EggHatchView);

let animationEvents = {
      moveEggToBasket: { id: 0, complete: false, animate: function(egg, eggIndex, basketIndex) {
        // kill any earlier animations still running
        resetAnimationEvents(true);

        if (eggIndex >= 0) {
          animatingEgg = egg;
          animatingEggIndex = eggIndex;
          animatingDrake = new BioLogica.Organism(BioLogica.Species.Drake, egg.alleles, egg.sex);
          targetBasketIndex = basketIndex;

          const leftOffset = MEDIUM_EGG_ON_BASKET_X_OFFSET,
                topOffset = modeCollectInBasket
                              ? MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET
                              : MEDIUM_EGG_ON_BASKET_Y_OFFSET;
          appendAnimation('moveEggToBasket',
            <FastEggHatch
                egg={animatingEgg} organism={animatingDrake}
                initial={{ id: `egg-${animatingEggIndex}` }}
                initialStyle={{ size: EGG_IMAGE_WIDTH, hatchProgress: 0 }}
                target={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset }}
                targetStyle={{ size: EGG_IMAGE_WIDTH_MEDIUM }}
                onRest={function() { animationFinish(animationEvents.moveEggToBasket.id); }}
            />);
        }
      }},
      hatchDrakeInBasket: { id: 1, complete: false, animate: function() {
        const leftOffset = MEDIUM_EGG_ON_BASKET_X_OFFSET,
              topOffset = modeCollectInBasket
                            ? MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET
                            : MEDIUM_EGG_ON_BASKET_Y_OFFSET;
        appendAnimation('hatchDrakeInBasket',
          <FastEggHatch
              egg={animatingEgg} organism={animatingDrake} glow={true}
              initial={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset }}
              initialStyle={{ size: EGG_IMAGE_WIDTH_MEDIUM, hatchProgress: 0 }}
              target={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset }}
              targetStyle={{ hatchProgress: 1 }}
              onRest={function() { animationFinish(animationEvents.hatchDrakeInBasket.id); }}
          />);
      }},
      fadeDrakeAway: { id: 2, complete: false, animate: function() {
        const { baskets } = _this.props,
              targetBasket = targetBasketIndex >= 0 ? baskets[targetBasketIndex] : null,
              leftOffset = MEDIUM_EGG_ON_BASKET_X_OFFSET,
              initialTop = modeFadeAway
                            ? MEDIUM_EGG_ON_BASKET_Y_OFFSET
                            : MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET,
              targetTop = isSubmittedEggCorrect
                            ? MEDIUM_EGG_BELOW_BASKET_Y_OFFSET
                            : MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET;
        _this.clearSelection();
        resetAnimationEvents(false);

        // click handler forwards to underlying basket; otherwise, the animating view interferes
        // with click handling until the fade is complete.
        function handleClick(evt) {
          _this.handleBasketClick(targetBasketIndex, targetBasket);
          evt.stopPropagation();
        }
        
        appendAnimation('fadeDrakeAway',
          <SlowEggHatch
              egg={animatingEgg} organism={animatingDrake} glow={true}
              initial={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset: initialTop }}
              initialStyle={{ size: EGG_IMAGE_WIDTH_MEDIUM, opacity: 1, hatchProgress: 1 }}
              target={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset: targetTop }}
              targetStyle={{ opacity: 0 }}
              onClick={handleClick}
              onRest={function() { animationFinish(animationEvents.fadeDrakeAway.id); }}
          />);
      }},
      settleEggInBasket: { id: 3, complete: false, animate: function() {
        _this.clearSelection();
        resetAnimationEvents(false);

        const initialLeft = MEDIUM_EGG_ON_BASKET_X_OFFSET,
              targetLeft = SMALL_EGG_ON_BASKET_X_OFFSET,
              initialTop = MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET,
              targetTop = SMALL_EGG_ON_BASKET_Y_OFFSET;
        appendAnimation('settleEggInBasket',
          <FastEggHatch
              egg={animatingEgg} organism={animatingDrake} glow={true}
              initial={{ id: `basket-${targetBasketIndex}`, leftOffset: initialLeft, topOffset: initialTop }}
              initialStyle={{ size: EGG_IMAGE_WIDTH_MEDIUM, hatchProgress: 1 }}
              target={{ id: `basket-${targetBasketIndex}`, leftOffset: targetLeft, topOffset: targetTop }}
              targetStyle={{ size: EGG_IMAGE_WIDTH_SMALL, hatchProgress: 0 }}
              onRest={function() { animationFinish(animationEvents.settleEggInBasket.id); }}
          />);
      }}
    };

function resetAnimationEvents(clearEggSequence) {
  if (clearEggSequence) {
    animatingEgg = null;
    animatingEggIndex = null;
    animatingDrake = null;
    targetBasketIndex = null;
  }
  _this.setState({ animation: null, animatedComponents: [] });
}

function appendAnimation(animation, component) {
  const newComponent = React.cloneElement(component, { key: lastAnimatedComponentId++ });
  _this.setState(function(prevState) {
    prevState.animation = animation;
    prevState.animatedComponents.push(newComponent);
  });
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
    animatedComponents: [],
    eggs: []
  }

  componentWillMount() {
    _this = this;
    this.createEggsFromDrakes(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { case: prevCase, challenge: prevChallenge, trial: prevTrial,
            correct: prevCorrect, errors: prevErrors } = this.props,
          { case: nextCase, challenge: nextChallenge, trial: nextTrial,
            correct: nextCorrect, errors: nextErrors } = nextProps;
    if ((prevCase !== nextCase) || (prevChallenge !== nextChallenge) || (prevTrial !== nextTrial)) {
      resetAnimationEvents(true);
      this.createEggsFromDrakes(nextProps);
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

  createEggsFromDrakes(props) {
    const { drakes } = props,
          eggs = drakes.map((child) =>
                    new BioLogica.Organism(BioLogica.Species.Drake, child.alleleString, child.sex));
    this.setState({ eggs });
  }

  selectedEgg() {
    const { drakes } = this.props,
          { eggs } = this.state,
          eggDrakeIndex = drakes.findIndex((drake) => drake && drake.isSelected),
          eggIndex = eggDrakeIndex != null && eggDrakeIndex >= 0 ? eggDrakeIndex : null,
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
          currSelectedIndices = currSelectedIndex != null ? [currSelectedIndex] : [];
    if (!_.isEqual(selectedIndices, currSelectedIndices))
      onChangeDrakeSelection(selectedIndices);
  }

  handleBackgroundClick = () => {
    this.clearSelection();
  }

  handleBasketClick = (basketIndex, basket) => {
    const { correct, errors, onSubmitEggForBasket } = this.props,
          { eggs } = this.state,
          { index: selectedEggIndex, egg: selectedEgg } = this.selectedEgg(),
          eggDrakeIndex = selectedEggIndex,
          isChallengeComplete = correct + errors + 1 >= eggs.length;
    isSubmittedEggCorrect = selectedEgg && isEggCompatibleWithBasket(selectedEgg, basket);
    if (selectedEgg) {
      animationEvents.moveEggToBasket.animate(selectedEgg, selectedEggIndex, basketIndex);
      onSubmitEggForBasket(eggDrakeIndex, basketIndex, isSubmittedEggCorrect, isChallengeComplete);
    }
    this.setBasketSelection([basketIndex]);
  }

  handleEggClick = (id, index) => {
    this.setEggSelection([index]);
    this.selectAllBaskets();
  }

  render() {
    const { hiddenAlleles, drakes, baskets, correct, errors } = this.props,
          { animation, animatedComponents, eggs } = this.state,
          selectedBaskets = this.selectedBaskets(),
          { index: selectedEggIndex, egg: selectedEgg } = this.selectedEgg(),
          animatingEggDrakeIndex = (animatingEggIndex != null) ? animatingEggIndex : null,
          isHatchingDrakeInEgg = (animation === "hatchDrakeInEgg") ||
                                  ((animation === "complete") && (animatingEggIndex != null)),
          showSelectedEggIndex = isHatchingDrakeInEgg ? -1 : selectedEggIndex,
          basketEggs = modeCollectInBasket ? eggs : null,
          displayEggs = eggs.map((egg, index) => {
            const isAnimatingEgg = (animatingEggIndex === index),
                  drake = drakes[index],
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
                            eggs={basketEggs} animatingEggIndex={animatingEggDrakeIndex}
                            onClick={disableSelection ? null : this.handleBasketClick}/>
          </div>
          <div id="eggs">
            <EggClutchView eggs={displayEggs} selectedIndex={showSelectedEggIndex}
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
    if (authoredChallenge.trialGenerator)
      return generateTrialDrakes(authoredChallenge.trialGenerator);
    return [];
  }

}
