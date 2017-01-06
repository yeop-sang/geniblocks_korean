import React, { Component, PropTypes } from 'react';
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
function lookupGameteChromosomeDOMElement(org, chromosomeName) {
  let wrapperId = org.sex === 0 ? "father-gamete-genome" : "mother-gamete-genome",
      wrapper = document.getElementById(wrapperId),
      chromosomePositions = {"1": 0, "2": 1, "XY": 2};
  let genomeWrapper = wrapper.getElementsByClassName("genome")[0];
  return genomeWrapper.querySelectorAll(".chromosome-image")[chromosomePositions[chromosomeName]];
}

function findBothElements(org, name, el){
  let t = lookupGameteChromosomeDOMElement(org, name);
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

var animationEvents = {
  showGametes: { id: 0, count: 0, complete: false, animate: function() {
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
      animateMultipleComponents([animatedOvumView, animatedSpermView],  [motherPositions, fatherPositions], opacity, animationEvents.showGametes.id);
      if (_this) _this.setState({animation:"showGametes"});
    }
  },
  moveGametes: { id: 1, count: 0, complete: false, animate: function(){
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

      animateMultipleComponents([animatedOvumView, animatedSpermView], [motherPositions, fatherPositions], opacity, animationEvents.moveGametes.id);
      if (_this) _this.setState({animation:"moveGametes"});
    }
  },
  selectChromosome: { id: 2, complete: false, ready: false, animate: function(positions, targetIsY){
      let opacity = {
        start: 1.0,
        end: 0.0
      };
      animatedComponentToRender = <ChromosomeImageView small={true} empty={false} bold={false} yChromosome={targetIsY}/>;
      animateMultipleComponents([animatedComponentToRender], [positions], opacity, animationEvents.selectChromosome.id);
      if (_this) _this.setState({animation:"selectChromosome"});
    }
  },
  fertilize: { id: 3, inProgress: false, complete: false, animate: function(){
      animationEvents.selectChromosome.ready = false;
      animationEvents.fertilize.started = true;

      setTimeout( () => {
        animationFinish(animationEvents.fertilize.id);
      }, 3000);
    }
  },
  hatch: { id: 4, inProgress: false, complete: false, animate: function(){
      animationEvents.hatch.inProgress = true;
      animationEvents.hatch.complete = false;
      hatchSoundPlayed = false;
      if (_this) _this.setState({hatchStarted:"true"});
      setTimeout( () => {
        animationFinish(animationEvents.hatch.id);
      }, 3000);
    }
  }

};
function resetAnimationEvents(iShowGametes, iShowHatchAnimation){
  animationEvents.showGametes.count = 0;
  animationEvents.moveGametes.count = 0;
  animationEvents.selectChromosome.ready = true;
  animationEvents.fertilize.started = false;
  animationEvents.fertilize.complete = false;
  animationEvents.hatch.inProgress = false;
  animationEvents.hatch.complete = false;
  showHatchAnimation = !!iShowHatchAnimation;
  showStaticGametes(!!iShowGametes);
}

function runAnimation(animationEvent, positions, opacity, speed = "fast"){
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
      onRest={animationFinish} />);
  lastAnimatedComponentId++;
}

function animationFinish(evt){
  switch(evt){
    case animationEvents.showGametes.id:
      animationEvents.showGametes.count++;
      if (animationEvents.showGametes.count === 2){
        animationEvents.showGametes.complete = true;
        animatedComponents = [];
        animationEvents.moveGametes.animate();
      }
      break;
    case animationEvents.moveGametes.id:
      animationEvents.moveGametes.count++;
      if (animationEvents.moveGametes.count === 2){
        animatedComponents = [];
        // show static gametes when move complete
        showStaticGametes(true);
        animationEvents.moveGametes.complete = true;
        animationEvents.selectChromosome.ready = true;
        // show gamete placeholders
        chromosomeDisplayStyle = {};
      }
      break;
    case animationEvents.fertilize.id:
      animationEvents.fertilize.complete = true;
      // hide static gametes during fertilization
      showStaticGametes(false);
      if (showHatchAnimation)
        animationEvents.hatch.animate();
      else
        animationEvents.hatch.complete = true;
      break;
    case animationEvents.hatch.id:
      animationEvents.hatch.complete = true;
      break;
    default:
      break;
  }
  if (_this) _this.setState({animation:"complete"});
}

function animateMultipleComponents(componentsToAnimate, positions, opacity, animationEvent){
  for (let i = 0; i < componentsToAnimate.length; i++){
    animatedComponentToRender = componentsToAnimate[i];
    runAnimation(animationEvent, positions[i], opacity);
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

  render() {
    const { challengeType, interactionType, instructions, showUserDrake, trial, drakes, gametes,
            hiddenAlleles, userDrakeHidden, onChromosomeAlleleChange, onGameteChromosomeAdded, 
            onFertilize, onHatch, onResetGametes, onKeepOffspring, onDrakeSubmission } = this.props,
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
    const handleChromosomeSelected = function(org, name, side, el) {
      if (animationEvents.selectChromosome.ready){
        let positions = findBothElements(org, name, el);
        let targetIsY = el.getElementsByClassName("chromosome-allele-container")[0].id.endsWith('XYy');
        // animate the chromosomes being added
        animationEvents.selectChromosome.animate(positions, targetIsY);

        setTimeout(function() {
          onGameteChromosomeAdded(org.sex, name, side);
        }, 500);
      }
    };
    const handleFertilize = function() {
      if (Object.keys(gametes[0]).length === 3 && Object.keys(gametes[1]).length === 3) {
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

    function getGameteChromosome(index, chromosomeName) {
      var parent = index === 1 ? mother : father;
      if (gametes[index][chromosomeName]) {
        return parent.getGenotype().chromosomes[chromosomeName][gametes[index][chromosomeName]];
      }
    }

    const femaleGameteChromosomeMap = {
      "1":  { a: getGameteChromosome(1, 1)},
      "2":  { a: getGameteChromosome(1, 2)},
      "XY": { a: getGameteChromosome(1, "XY") }
    };

    const maleGameteChromosomeMap = {
      "1":  { b: getGameteChromosome(0, 1)},
      "2":  { b: getGameteChromosome(0, 2)},
      "XY": { b: getGameteChromosome(0, "XY") }
    };

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
        if (Object.keys(gametes[0]).length !== 3 || Object.keys(gametes[1]).length !== 3) {
          text = t("~BUTTON.FERTILIZE_DISABLED"),
          buttonClasses += " disabled";
        }
        childView = <ButtonView className={ buttonClasses } label={ text } onClick={ handleFertilize } />;
      }
    }
    let oChroms = femaleGameteChromosomeMap,
        sChroms = maleGameteChromosomeMap,
        ovumChromosomes  = [oChroms[1] && oChroms[1].a, oChroms[2] && oChroms[2].a, oChroms.XY && oChroms.XY.a],
        spermChromosomes = [sChroms[1] && sChroms[1].b, sChroms[2] && sChroms[2].b, sChroms.XY && sChroms.XY.b],
        ovumSelected = mapChromosomesToSide(gametes[1], 'a'),
        spermSelected = mapChromosomesToSide(gametes[0], 'b'),
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
            <GenomeView className={parentGenomeClass} orgName="mother" org={ mother } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[1] } />
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
            <GenomeView className={parentGenomeClass} orgName="father" org={ father } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[0] } />
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
