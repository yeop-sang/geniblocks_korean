import React, { Component, PropTypes } from 'react';
import { assign, clone } from 'lodash';
import classNames from 'classnames';
import OrdinalOrganismView from '../components/ordinal-organism';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import PenView from '../components/pen';
import GameteImageView from '../components/gamete-image';
import AnimatedComponentView from '../components/animated-component';
import ChromosomeImageView from '../components/chromosome-image';
import t from '../utilities/translate';

// a "reasonable" lookup function for the two gametes
function lookupGameteChromosomeDOMElement(sex, chromosomeName) {
  let wrapperId = sex === BioLogica.MALE ? "father-gamete-genome" : "mother-gamete-genome",
      wrapper = document.getElementById(wrapperId),
      chromosomePositions = {"1": 0, "2": 1, "XY": 2};
  let genomeWrapper = wrapper.getElementsByClassName("genome")[0];
  return genomeWrapper.querySelectorAll(".chromosome-image")[chromosomePositions[chromosomeName]];
}

function findBothElements(sex, name, el){
  let t = lookupGameteChromosomeDOMElement(sex, name);
  let s = el.getElementsByClassName("chromosome-allele-container")[0]; // the image of the alleles inside the chromosome container
  let positions = {
    startPositionRect : s.getClientRects()[0],
    targetPositionRect: t.getClientRects()[0]
  };
  return positions;
}

var _this,
  animatedComponents = [],
  animatedComponentToRender,
  startDisplay, targetDisplay,
  lastAnimatedComponentId = 0,
  animationTimeline = {},
  mother, father,
  authoredDrakes = [],
  challengeDidChange = true,
  ovumTarget, spermTarget,
  animatedOvumView, animatedSpermView,

  motherDrakeStart, motherGameteStart,
  fatherDrakeStart, fatherGameteStart,

  gameteDisplayStyle = { display: "none" },
  chromosomeDisplayStyle = {display: "none"},

  showHatchAnimation = false,
  hatchSoundPlayed = false,
  offsetTopDrake = 130, offsetTopGamete = 160;

function oneOf(array) {
  if (!array || !array.length) return;
  return array[Math.floor(array.length * Math.random())];
}

var animationEvents = {
  showGametes: { id: 0, count: 0, complete: false,
    animate: function() {
      let motherPositions = {
          startPositionRect : motherDrakeStart,
          targetPositionRect: motherGameteStart,
          startSize: 0.3,
          endSize: 0.3
        };

      let fatherPositions = {
        startPositionRect : fatherDrakeStart,
        targetPositionRect: fatherGameteStart,
        startSize: 0.3,
        endSize: 0.3
      };

      let displayStyleContainer = {animated: true, size: 0.3};
      animatedOvumView  = <GameteImageView isEgg={true} displayStyle={displayStyleContainer} />;
      animatedSpermView = <GameteImageView isEgg={false} displayStyle={displayStyleContainer} />;

      let opacity = {
        start: 1.0,
        end: 1.0
      };

      // hide the static gametes while the animated gametes are visible
      showStaticGametes(false);
      animateMultipleComponents([animatedOvumView, animatedSpermView], 
                                [motherPositions, fatherPositions],
                                opacity, animationEvents.showGametes.id,
                                animationEvents.showGametes.onFinish);
      if (_this) _this.setState({animation:"showGametes"});
    },
    onFinish: function() {
      if (++animationEvents.showGametes.count === 2){
        animationEvents.showGametes.complete = true;
        animatedComponents = [];
        animationEvents.moveGametes.animate();
        if (_this) _this.setState({ animation: 'complete' });
      }
    }
  },
  moveGametes: { id: 1, count: 0, complete: false,
    animate: function() {
      let motherPositions = {
          startPositionRect : motherGameteStart,
          targetPositionRect: ovumTarget,
          startSize: 0.3,
          endSize: 1.0
      };

      let fatherPositions = {
        startPositionRect : fatherGameteStart,
        targetPositionRect: spermTarget,
        startSize: 0.3,
        endSize: 1.0
      };

      let opacity = {
        start: 1.0,
        end: 1.0
      };

      animateMultipleComponents([animatedOvumView, animatedSpermView],
                                [motherPositions, fatherPositions],
                                opacity, animationEvents.moveGametes.id,
                                animationEvents.moveGametes.onFinish);
      if (_this) _this.setState({animation:"moveGametes"});
    },
    onFinish: function() {
      if (++animationEvents.moveGametes.count === 2){
        animatedComponents = [];
        // show static gametes when move complete
        showStaticGametes(true);
        animationEvents.moveGametes.complete = true;
        animationEvents.selectChromosome.ready = true;
        // show gamete placeholders
        chromosomeDisplayStyle = {};

        animationEvents.randomizeChromosomes.animate();
      }
    }
  },
  randomizeChromosomes: { id: 2, stages: [], count: 0, complete: false, ready: false,
    animate: function() {
      let stages = animationEvents.randomizeChromosomes.stages,
          stageIndex = animationEvents.randomizeChromosomes.count,
          chromosomeIterations = 10,
          randomMotherGamete = {},
          randomFatherGamete = {};

      function addAnimStage(sex, chromName, sides) {
        const motherBaseGamete = clone(randomMotherGamete),
              fatherBaseGamete = clone(randomFatherGamete);
        let stage = { gametes: [], sex, chromName, side: oneOf(sides) };
        for (let i = 0; i < chromosomeIterations; ++i) {
          const motherAltGamete = sex === BioLogica.FEMALE
                                    ? assign({}, motherBaseGamete, { [chromName]: oneOf(sides) })
                                    : motherBaseGamete,
                fatherAltGamete = sex === BioLogica.MALE
                                    ? assign({}, fatherBaseGamete, { [chromName]: oneOf(sides) })
                                    : fatherBaseGamete;
          stage.gametes.push([fatherAltGamete, motherAltGamete, fatherBaseGamete, motherBaseGamete]);
          stage.gametes.push([fatherBaseGamete, motherBaseGamete, fatherBaseGamete, motherBaseGamete]);
        }
        if (sex === BioLogica.FEMALE)
          randomMotherGamete[chromName] = stage.side;
        else
          randomFatherGamete[chromName] = stage.side;
        stage.gametes.push([clone(randomFatherGamete), clone(randomMotherGamete),
                            clone(randomFatherGamete), clone(randomMotherGamete)]);
        stages.push(stage);
      }

      if (!stages.length) {
        // random selections for mother's chromosomes
        addAnimStage(BioLogica.FEMALE, '1', ['a', 'b']);
        addAnimStage(BioLogica.FEMALE, '2', ['a', 'b']);
        addAnimStage(BioLogica.FEMALE, 'XY', ['x1', 'x2']);

        // random selections for father's chromosomes
        addAnimStage(BioLogica.MALE, '1', ['a', 'b']);
        addAnimStage(BioLogica.MALE, '2', ['a', 'b']);
        addAnimStage(BioLogica.MALE, 'XY', ['x', 'y']);
      }

      function animateStage(stage) {
        if (stage.index == null) stage.index = 0;
        if (_this && (stage.index < stage.gametes.length)) {
          _this.setState({ animatingGametes: stage.gametes[stage.index] });
          if (++stage.index < stage.gametes.length) {
            setTimeout(() => animateStage(stage), 100);
          }
          else {
            const parentId = stage.sex === BioLogica.FEMALE ? 'mother' : 'father',
                  chromContainerId = `${parentId}${stage.chromName}${stage.side}`,
                  el = document.getElementById(chromContainerId).parentNode;
            // this will trigger an animation which will call onFinish() when complete,
            // which will trigger the next stage of the animation.
            _this.selectChromosome(stage.sex, stage.chromName, stage.side, el,
                                  animationEvents.randomizeChromosomes.onFinish);
            stage.index = null;
          }
        }
      }

      if (stageIndex < stages.length)
        animateStage(stages[stageIndex]);
      if (_this) _this.setState({ animation: 'randomizeChromosomes' });
    },
    onFinish: function() {
      if (++animationEvents.randomizeChromosomes.count < animationEvents.randomizeChromosomes.stages.length)
        animationEvents.randomizeChromosomes.animate();
      else
        if (_this) _this.setState({ animation: 'complete' });
    }
  },
  selectChromosome: { id: 3, complete: false, ready: false,
    animate: function(positions, targetIsY, onFinish) {
      let opacity = {
        start: 1.0,
        end: 0.0
      };
      animatedComponentToRender = <ChromosomeImageView small={true} empty={false} bold={false} yChromosome={targetIsY}/>;
      animateMultipleComponents([animatedComponentToRender], [positions], opacity,
                                animationEvents.selectChromosome.id, onFinish);
      if (_this) _this.setState({animation:"selectChromosome"});
    }
  },
  fertilize: { id: 4, inProgress: false, complete: false,
    animate: function(){
      animationEvents.selectChromosome.ready = false;
      animationEvents.fertilize.started = true;

      setTimeout(animationEvents.fertilize.onFinish, 3000);
    },
    onFinish: function() {
      animationEvents.fertilize.complete = true;
      // hide static gametes during fertilization
      showStaticGametes(false);
      if (showHatchAnimation)
        animationEvents.hatch.animate();
      else
        animationEvents.hatch.complete = true;
      if (_this) _this.setState({ animation: 'complete' });
    }
  },
  hatch: { id: 5, inProgress: false, complete: false,
    animate: function() {
      animationEvents.hatch.inProgress = true;
      animationEvents.hatch.complete = false;
      hatchSoundPlayed = false;
      if (_this) _this.setState({hatchStarted:"true"});
      setTimeout(animationEvents.hatch.onFinish, 3000);
    },
    onFinish: function() {
      animationEvents.hatch.complete = true;
      if (_this) _this.setState({animation:"complete"});
    }
  }

};
function resetAnimationEvents(iShowGametes, iShowHatchAnimation){
  animationEvents.showGametes.count = 0;
  animationEvents.moveGametes.count = 0;
  animationEvents.randomizeChromosomes.count = 0;
  animationEvents.randomizeChromosomes.stages = [];
  animationEvents.selectChromosome.ready = true;
  animationEvents.fertilize.started = false;
  animationEvents.fertilize.complete = false;
  animationEvents.hatch.inProgress = false;
  animationEvents.hatch.complete = false;
  showHatchAnimation = !!iShowHatchAnimation;
  showStaticGametes(!!iShowGametes);
}

function runAnimation(animationEvent, positions, opacity, speed, onFinish){
  startDisplay = {
    startPositionRect: positions.startPositionRect,
    opacity: opacity.start,
    size: positions.startSize
  };
  targetDisplay = {
    targetPositionRect: positions.targetPositionRect,
    opacity: opacity.end,
    size: positions.endSize
  };

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
      onRest={onFinish} />);
  lastAnimatedComponentId++;
}

function animateMultipleComponents(componentsToAnimate, positions, opacity, animationEvent, onFinish){
  for (let i = 0; i < componentsToAnimate.length; i++){
    animatedComponentToRender = componentsToAnimate[i];
    runAnimation(animationEvent, positions[i], opacity, 'fast', onFinish);
  }
}

function areGametesEmpty(gametes) {
  const length = gametes && gametes.length;
  for (let i = 0; i < length; ++i) {
    let gamete = gametes[i];
    if (gamete && Object.keys(gamete).length)
      return false;
  }
  return true;
}

function isGameteComplete(gamete) {
  return gamete && Object.keys(gamete).length === 3;
}

function areGametesComplete(gametes) {
  const length = gametes && gametes.length;
  return (length >= 2) && isGameteComplete(gametes[0]) && isGameteComplete(gametes[1]);
}

function showStaticGametes(show) {
  gameteDisplayStyle = show ? {} : { display: "none" };
}

export default class EggGame extends Component {

  state = {}

  componentWillMount() {
    challengeDidChange = true;
    resetAnimationEvents(false, this.props.showUserDrake);
  }

  componentWillReceiveProps(nextProps) {
    const { case: prevCase, challenge: prevChallenge,
            trial: prevTrial, gametes: prevGametes } = this.props,
          { case: nextCase, challenge: nextChallenge,
            trial: nextTrial, gametes: nextGametes,
            showUserDrake, onResetGametes } = nextProps,
          newChallenge = (prevCase !== nextCase) || (prevChallenge !== nextChallenge),
          newTrialInChallenge = !newChallenge && (prevTrial !== nextTrial),
          gametesReset = !areGametesEmpty(prevGametes) && areGametesEmpty(nextGametes);
    if (newChallenge || newTrialInChallenge || gametesReset) {
      if (newChallenge) {
        challengeDidChange = true;
      }
      resetAnimationEvents(!challengeDidChange, showUserDrake);
      if (newTrialInChallenge && onResetGametes) {
        onResetGametes();
        showStaticGametes(true);
      }
    }
  }

  handleChromosomeSelected = (org, name, side, el) => {
    this.selectChromosome(org.sex, name, side, el);
  }

  selectChromosome(sex, name, side, el, onFinish) {
    if (animationEvents.selectChromosome.ready) {
      if (!onFinish) {
        setTimeout(() => {
          this.props.onGameteChromosomeAdded(sex, name, side);
        }, 500);
      }

      let positions = findBothElements(sex, name, el);
      let targetIsY = el.getElementsByClassName("chromosome-allele-container")[0].id.endsWith('XYy');
      // animate the chromosomes being added
      animationEvents.selectChromosome.animate(positions, targetIsY, onFinish);
    }
  }

  render() {
    const { challengeType, interactionType, instructions, showUserDrake, trial, drakes, gametes,
            hiddenAlleles, userDrakeHidden, onChromosomeAlleleChange, 
            onFertilize, onHatch, onResetGametes, onKeepOffspring, onDrakeSubmission } = this.props,
          { animatingGametes } = this.state,
          firstTargetDrakeIndex = 3, // 0: mother, 1: father, 2: child, 3-5: targets
          targetDrake = drakes[firstTargetDrakeIndex + trial],
          isCreationChallenge = challengeType === 'create-unique',
          isMatchingChallenge = challengeType === 'match-target',
          isSelectingGametes = interactionType === 'select-gametes',
          isSelectingChromosomes = !isSelectingGametes,
          challengeClasses = {
                                'creation': isCreationChallenge,
                                'matching': isMatchingChallenge,
                                'chromosomes': isSelectingChromosomes,
                                'gametes': isSelectingGametes
                              },
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);

    let child = null;
    if (drakes[2]) {
      child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex);
    }

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
      onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
    };
    const handleFertilize = function() {
      if (areGametesComplete(gametes)) {
        animationEvents.selectChromosome.ready = false;
        animatedComponents = [];
        animationEvents.fertilize.animate();
        onFertilize(0,1);
      }
    };

    const handleHatch = function () {
      if (!hatchSoundPlayed) {
        onHatch();
        hatchSoundPlayed = true;
      }
    };

    const handleSubmit = function () {
      let childImage = child.getImageName(),
          [,,,...keptDrakes] = drakes,
          success = false;
      if (challengeType === 'create-unique') {
        success = true;
        for (let drake of keptDrakes) {
          let org = new BioLogica.Organism(BioLogica.Species.Drake, drake.alleleString, drake.sex);
          if (org.getImageName() === childImage) {
            success = false;
            break;
          }
        }
        onKeepOffspring(2, success, 8);
      }
      else if (challengeType === 'match-target') {
        const targetDrakeOrg = new BioLogica.Organism(BioLogica.Species.Drake,
                                                      targetDrake.alleleString,
                                                      targetDrake.sex);
        success = (childImage === targetDrakeOrg.getImageName());
        onDrakeSubmission(targetDrakeOrg.phenotype, child.phenotype, success, "resetGametes");
      }
    };
    const handleReset = function() {
      resetAnimationEvents(true, showUserDrake);
      onResetGametes();
    };

    function getGameteChromosomeMap(parent, gamete, side) {
      var parentChromosomes = parent && parent.getGenotype().chromosomes;
      return {
        '1': { [side]: parentChromosomes['1'][gamete['1']] },
        '2': { [side]: parentChromosomes['2'][gamete['2']] },
        'XY': { [side]: parentChromosomes['XY'][gamete['XY']] }
      };
    }

    function getChromosomesFromMap(chromosomeMap, side) {
      return [chromosomeMap[1] && chromosomeMap[1][side],
              chromosomeMap[2] && chromosomeMap[2][side],
              chromosomeMap.XY && chromosomeMap.XY[side]];
    }

    // map all chromosomes in a gamete to a single side for selection purposes
    function mapChromosomesToSide(gamete, side) {
      let chromName, mappedGamete = {};
      for (chromName in gamete) {
        mappedGamete[chromName] = side;
      }
      return mappedGamete;
    }

    // create the trial feedback views
    function mapTargetDrakesToFeedbackViews(drakes, currentTrial) {
      let ordOrgViews = [];
      for (let i = firstTargetDrakeIndex; i < drakes.length; ++i) {
        const trial = i - firstTargetDrakeIndex,
              isCompleted = currentTrial >= trial,
              ordinal = trial + 1,
              drake = drakes[i],
              organism = currentTrial > trial
                          ? new BioLogica.Organism(BioLogica.Species.Drake,
                                                    drake.alleleString,
                                                    drake.sex)
                          : null,
              bgColor = isCompleted ? "#AAAAAA" : null,
              targetID = `target-${trial+1}`,
              classes = classNames('matched-target', { 'complete': isCompleted }),
              ordOrgView = <OrdinalOrganismView id={targetID} className={classes}
                                                ordinal={ordinal} organism={organism}
                                                bgColor={bgColor} key={targetID}/>;
        ordOrgViews.push(ordOrgView);
      }
      return ordOrgViews;
    }

    const gametesClass = classNames('gametes', { 'unfertilized': !drakes[2] });

    const instructionsBanner = instructions
                                ? <div className="instructions-banner">
                                    <div className="instructions-text">{instructions}</div>
                                  </div>
                                : null,
          targetDrakeOrg = targetDrake && targetDrake.alleleString
                              ? new BioLogica.Organism(BioLogica.Species.Drake,
                                                        targetDrake.alleleString,
                                                        targetDrake.sex)
                              : null,
          targetDrakeView = isMatchingChallenge && targetDrakeOrg
                              ? <div className='target-drake'>
                                  <OrganismView className="target" org={targetDrakeOrg} width={140} key={0} />
                                </div>
                              : null,
          targetDrakeSection = isMatchingChallenge
                                ? <div className='target-section'>
                                    {targetDrakeView}
                                    <div className='target-counters'>
                                      {mapTargetDrakesToFeedbackViews(drakes, trial)}
                                    </div>
                                  </div>
                                : null,
          eggClasses = classNames('egg-image', challengeClasses),
          eggImageView = <img className={eggClasses} src="resources/images/egg_yellow.png" key={1}/>;
    let childView, ovumView, spermView, penView;
    if (drakes[2] && animationEvents.hatch.complete) {
      if (showUserDrake)
        handleHatch();
      const child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex),
            drakeImageView = <OrganismView className="matching" org={ child } width={140} key={1} />,
            eggOrDrakeView = showUserDrake || !userDrakeHidden ? drakeImageView : eggImageView,
            saveOrSubmitTitle = isCreationChallenge ? t("~BUTTON.SAVE_DRAKE") : t("~BUTTON.SUBMIT"),
            tryAgainOrResetTitle = isCreationChallenge ? t("~BUTTON.TRY_AGAIN") : t("~BUTTON.RESET");
      childView = (
        [
          eggOrDrakeView,
          <div className="offspring-buttons" key={2}>
            <ButtonView label={ saveOrSubmitTitle } onClick={ handleSubmit } key={3} />
            <ButtonView label={ tryAgainOrResetTitle } onClick={ handleReset } key={4} />
          </div>
        ]
      );
    } else {
      if (animationEvents.hatch.inProgress) {
        childView = eggImageView;
      } else {
        let text = t("~BUTTON.FERTILIZE"),
            buttonClasses = classNames('fertilize-button', challengeClasses);
        if (!areGametesComplete(gametes)) {
          text = t("~BUTTON.FERTILIZE_DISABLED"),
          buttonClasses += " disabled";
        }
        childView = <ButtonView className={ buttonClasses } label={ text } onClick={ handleFertilize } />;
      }
    }
    const motherSelectedChromosomes = animatingGametes ? animatingGametes[1] : gametes[1],
          fatherSelectedChromosomes = animatingGametes ? animatingGametes[0] : gametes[0],
          motherBaseChromosomes = animatingGametes ? animatingGametes[3] : gametes[1],
          fatherBaseChromosomes = animatingGametes ? animatingGametes[2] : gametes[0],
          femaleGameteChromosomeMap = getGameteChromosomeMap(mother, motherBaseChromosomes, 'a'),
          maleGameteChromosomeMap = getGameteChromosomeMap(father, fatherBaseChromosomes, 'b'),
          ovumChromosomes = getChromosomesFromMap(femaleGameteChromosomeMap, 'a'),
          spermChromosomes = getChromosomesFromMap(maleGameteChromosomeMap, 'b'),
          ovumSelected = mapChromosomesToSide(motherSelectedChromosomes, 'a'),
          spermSelected = mapChromosomesToSide(fatherSelectedChromosomes, 'b'),
          ovumClasses = classNames('ovum', challengeClasses),
          spermClasses = classNames('sperm', challengeClasses);

    ovumView  = <GameteImageView className={ovumClasses}  isEgg={true}  chromosomes={ovumChromosomes} displayStyle={gameteDisplayStyle} />;
    spermView = <GameteImageView className={spermClasses} isEgg={false} chromosomes={spermChromosomes} displayStyle={gameteDisplayStyle} />;

    let [,,,...keptDrakes] = drakes;
    keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));

    if (isCreationChallenge) {
      penView = <div className='columns bottom'>
                  <PenView orgs={ keptDrakes } width={500} columns={5} rows={1} tightenRows={20}/>
                </div>;
    }

    const parentGenomeClass = classNames('parent', challengeClasses),
          childGenomeClass = classNames('child', challengeClasses);
    return (
      <div id="egg-game">
        {instructionsBanner}
        <div className="columns">
          <div className='column'>
            <div className="mother">Mother</div>
            <OrganismView org={ mother } flipped={ true } />
            <GenomeView className={parentGenomeClass} orgName="mother" org={ mother }
                        onAlleleChange={ handleAlleleChange } onChromosomeSelected={this.handleChromosomeSelected}
                        editable={false} hiddenAlleles= { hiddenAlleles } small={ true }
                        selectedChromosomes={ motherSelectedChromosomes } />
          </div>
          <div className='egg column'>
            { targetDrakeSection }
            <div className='fertilization'>
              { childView }
            </div>
            <div className={ gametesClass }>
              <div className='half-genome half-genome-left' id="mother-gamete-genome">
                { ovumView }
                <GenomeView className={childGenomeClass} orgName="targetmother" species={ mother.species }
                            chromosomes={ femaleGameteChromosomeMap } selectedChromosomes={ ovumSelected }
                            editable={false} hiddenAlleles={ hiddenAlleles }
                            small={ true } displayStyle={chromosomeDisplayStyle} />
              </div>
              <div className='half-genome half-genome-right' id="father-gamete-genome">
                { spermView }
                <GenomeView className={childGenomeClass} orgName="targetfather" species={ mother.species } 
                            chromosomes={ maleGameteChromosomeMap } selectedChromosomes={ spermSelected }
                            editable={false} hiddenAlleles={ hiddenAlleles }
                            small={ true } displayStyle={chromosomeDisplayStyle} />
              </div>
            </div>
          </div>
          <div className='column'>
            <div className="father">Father</div>
            <OrganismView org={ father } className="father" />
            <GenomeView className={parentGenomeClass} orgName="father" org={ father }
                        onAlleleChange={ handleAlleleChange } onChromosomeSelected={this.handleChromosomeSelected}
                        editable={false} hiddenAlleles= { hiddenAlleles } small={ true }
                        selectedChromosomes={ fatherSelectedChromosomes } />
          </div>
        </div>
        {penView}
        {animatedComponents}
      </div>
    );
  }

  updateComponentLayout() {
    // now that the DOM is loaded, get the positions of the elements
    mother = document.getElementsByClassName("mother")[0].getClientRects()[0];
    father = document.getElementsByClassName("father")[0].getClientRects()[0];

    ovumTarget = document.getElementsByClassName("ovum")[0].getClientRects()[0];
    spermTarget = document.getElementsByClassName("sperm")[0].getClientRects()[0];

    motherDrakeStart = {
      top: mother.top + offsetTopDrake,
      left: mother.left
    };
    motherGameteStart = {
      top: mother.top + offsetTopGamete,
      left: mother.left
    };
    fatherDrakeStart = {
      top: father.top + offsetTopDrake,
      left: father.left
    };
    fatherGameteStart = {
      top: father.top + offsetTopGamete,
      left: father.left
    };

    if (challengeDidChange) {
      // animate the gametes moving from parents after page has rendered
      setTimeout( () => {
        // first animation - show gametes
        animationEvents.showGametes.animate();
      }, 1000);
      challengeDidChange = false;
    }
  }

  componentDidMount() {
    _this = this;
    this.updateComponentLayout();
  }

  componentDidUpdate() {
    this.updateComponentLayout();
  }

  componentWillUnmount() {
    _this = null;
    resetAnimationEvents();
  }

  static propTypes = {
    case: PropTypes.number.isRequired,
    challenge: PropTypes.number.isRequired,
    challengeType: PropTypes.string.isRequired,
    interactionType: PropTypes.string,
    instructions: PropTypes.string,
    showUserDrake: PropTypes.bool.isRequired,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    gametes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    userDrakeHidden: PropTypes.bool,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onGameteChromosomeAdded: PropTypes.func.isRequired,
    onFertilize: PropTypes.func.isRequired,
    onHatch: PropTypes.func,
    onResetGametes: PropTypes.func,
    onKeepOffspring: PropTypes.func,
    onDrakeSubmission: PropTypes.func
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge, trial) {
    const motherDrake = authoredChallenge.mother,
          fatherDrake = authoredChallenge.father;
    if (authoredChallenge.challengeType === 'create-unique')
      return [motherDrake, fatherDrake];

    // already generated drakes
    if (trial > 0)
      return authoredDrakes;

    // challengeType === 'match-target'
    const mother = new BioLogica.Organism(BioLogica.Species.Drake,
                                          motherDrake.alleles,
                                          motherDrake.sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake,
                                          fatherDrake.alleles,
                                          fatherDrake.sex),
          // authored specs may be incomplete; these are complete specs
          motherSpec = { alleles: mother.getAlleleString(), sex: mother.sex },
          fatherSpec = { alleles: father.getAlleleString(), sex: father.sex },
          targetDrakeCount = authoredChallenge.targetDrakes.length;

    function childDrakesContain(alleles) {
      for (let i = 3; i < authoredDrakes.length; ++i) {
        if (authoredDrakes[i].alleles === alleles)
          return true;
      }
      return false;
    }

    authoredDrakes = [motherSpec, fatherSpec, null];
    for (let i = 0; i < targetDrakeCount; ++i) {
      let child, childAlleles;
      do {
        child = BioLogica.breed(mother, father, false);
        childAlleles = child.getAlleleString();
        // don't generate the same set of alleles twice
      } while (childDrakesContain(childAlleles));

      authoredDrakes.push({ alleles: childAlleles, sex: child.sex });
    }
    return authoredDrakes;
  }

  static initialGametesArray = function() {
    return [{}, {}];
  }

  static calculateGoalMoves = function() {
    // each incorrect submission counts as one move
    // the goal is to have no incorrect submissions
    return 0;
  }

}
