import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import PenView from '../components/pen';
import GameteImageView from '../components/gamete-image';
import { transientStateTypes } from '../actions';
import AnimatedComponentView from '../components/animated-component';
import ChromosomeImageView from '../components/chromosome-image';

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

var animatedComponents = [], 
    animatedComponentToRender,
    startDisplay, targetDisplay, 
    lastAnimatedComponentId = 0,
    ovumView, spermView,
    animationTimeline = {};

var animationEvents = {
  moveGametes:      { id: 0, count: 0, complete: false},
  selectChromosome: { id: 1, complete: false, ready: false},
  fertilize:        { id: 2, inProgress: false, complete: false },
  hatch:            { id: 3, inProgress: false, complete: false }
};

var _this;

function runAnimation(animationEvent, positions, opacity){
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
  let animationSpeed = "medium";
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

function animationFinish(animatedComponent){
  switch(animatedComponent){
    case animationEvents.moveGametes:
      animationEvents.moveGametes.count++;
      if (animationEvents.moveGametes.count === 2){
        animatedComponents = [];
        animationEvents.moveGametes.complete = true;
        animationEvents.selectChromosome.ready = true;
      }      
      break;

    default:
      break;
  }
  _this.setState({animation:"complete"});
}


export default class EggGame extends Component {
    
    render() {
      const { drakes, gametes, onChromosomeAlleleChange, onGameteChromosomeAdded, onFertilize, onResetGametes, onKeepOffspring, hiddenAlleles, transientStates } = this.props,
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);
  
      const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
        onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
      };
      const handleChromosomeSelected = function(org, name, side, el) {
        if (animationEvents.selectChromosome.ready){
          let positions = findBothElements(org, name, el);
          let targetIsY = el.getElementsByClassName("chromosome-allele-container")[0].id.endsWith('XYy');
          animatedComponentToRender = <ChromosomeImageView small={true} empty={false} bold={false} yChromosome={targetIsY}/>;
          let opacity = {
            start: 1.0,
            end: 0.0
          };
          runAnimation(animationEvents.selectChromosome, positions, opacity);

          onGameteChromosomeAdded(org.sex, name, side);
        }
      };
      const handleFertilize = function() {
        if (Object.keys(gametes[0]).length === 3 && Object.keys(gametes[1]).length === 3) {
          animationEvents.selectChromosome.ready = false;
          animatedComponents = [];
          onFertilize(2000, 0, 1);
        }
      };
      const handleKeepOffspring = function() {
        animationEvents.selectChromosome.ready = true;
        animationEvents.hatch.inProgress = false;
        onKeepOffspring();
      };
      const handleReset = function() {
        animationEvents.selectChromosome.ready = true;
        animationEvents.hatch.inProgress = false;
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

      let gametesClass = "gametes";
      if (transientStates.length === 0 && !drakes[2]) {
        gametesClass += " unfertilized";
      }

      var childView;
      if (drakes[2]) {
        let child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex);
        childView = (
          [
            <OrganismView org={ child } width={170} />,
            <div className="offspring-buttons fade-in-on-render">
              <ButtonView label={ "Save this" } onClick={ handleKeepOffspring } />
              <ButtonView label={ "Try again" } onClick={ handleReset } />
            </div>
          ]
        );
      } else if (transientStates.indexOf(transientStateTypes.HATCHING) > -1) {
        animationEvents.hatch.inProgress = true;
        childView = <img className="egg-image" src="resources/images/egg_yellow.png" />;
      } else if (transientStates.indexOf(transientStateTypes.FERTILIZING) === -1) {
        let text = "Fertilize ❤️",
            className = "fertilize-button";
        if (Object.keys(gametes[0]).length !== 3 || Object.keys(gametes[1]).length !== 3) {
          text = "Fertilize",
          className += " disabled";
        }
        childView = <ButtonView className={ className } label={ text } onClick={ handleFertilize } />;
      }

      if ((!drakes[2]) || transientStates.indexOf(transientStateTypes.FERTILIZING) > -1) {
        let oChroms = femaleGameteChromosomeMap,
            sChroms = maleGameteChromosomeMap,
            ovumChromosomes  = [oChroms[1] && oChroms[1].a, oChroms[2] && oChroms[2].a, oChroms.XY && oChroms.XY.a],
            spermChromosomes = [sChroms[1] && sChroms[1].b, sChroms[2] && sChroms[2].b, sChroms.XY && sChroms.XY.b];
        let displayStyle = {};
        if (!animationEvents.moveGametes.complete || animationEvents.hatch.inProgress) {
          displayStyle = {display: "none"};
        }
        ovumView  = <GameteImageView className="ovum"  isEgg={true}  chromosomes={ovumChromosomes} displayStyle={displayStyle} />;
        spermView = <GameteImageView className="sperm" isEgg={false} chromosomes={spermChromosomes} displayStyle={displayStyle} />;
      }

      let [,,,...keptDrakes] = drakes;
      keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));

      return (
      <div id="egg-game">
        <div className="columns">
          <div className='column'>
            <div className="mother">Mother</div>
              <OrganismView org={ mother } flipped={ true } />
              <GenomeView orgName="mother" org={ mother } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[1] } />
          </div>
          <div className='egg column'>
            <div className='top'>
              { childView }
            </div>
            <div className={ gametesClass }>
              <div className='half-genome half-genome-left' id="mother-gamete-genome">
                { ovumView }
                <GenomeView orgName="targetmother" chromosomes={ femaleGameteChromosomeMap } species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } small={ true } />
              </div>
              <div className='half-genome half-genome-right' id="father-gamete-genome">
                { spermView }
                <GenomeView orgName="targetfather" chromosomes={ maleGameteChromosomeMap }   species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } small={ true } />
              </div>
            </div>
          </div>
          <div className='column'>
            <div className="father">Father</div>
              <OrganismView org={ father } className="father" />
              <GenomeView orgName="father" org={ father } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[0] } />
          </div>
        </div>
        <div className='columns bottom'>
          <PenView orgs={ keptDrakes } width={500} columns={5} rows={1} tightenRows={20}/>
        </div>
        {animatedComponents}
      </div>
    );
  }

  componentDidMount() {
    // on first loading the game, animate the gametes moving from parents
    setTimeout( () => {
      let mother = document.getElementsByClassName("mother")[0].getClientRects()[0];
      let father = document.getElementsByClassName("father")[0].getClientRects()[0];
      
      let offsetTop = 150;
      let motherStart = {
        top: mother.top + offsetTop,
        left: mother.left
      };
      let fatherStart = {
        top: father.top + offsetTop,
        left: father.left
      };

      let ovumTarget = document.getElementsByClassName("ovum")[0].getClientRects()[0];
      let spermTarget = document.getElementsByClassName("sperm")[0].getClientRects()[0];
      
      let displayStyleContainer = {animated: true};
      let animatedOvumView  = <GameteImageView isEgg={true} displayStyle={displayStyleContainer} />;
      let animatedSpermView = <GameteImageView isEgg={false} displayStyle={displayStyleContainer} />;

      let opacity = {
        start: 1.0,
        end: 1.0
      };
      // first the ovum
      animatedComponentToRender = animatedOvumView;
      let motherPositions = { 
        startPositionRect : motherStart,
        targetPositionRect: ovumTarget,
        startSize: 0.3,
        endSize: 1.0
      };
      runAnimation(animationEvents.moveGametes, motherPositions, opacity);

      // now the sperm
      animatedComponentToRender = animatedSpermView;
      let fatherPositions = { 
        startPositionRect : fatherStart,
        targetPositionRect: spermTarget,
        startSize: 0.3,
        endSize: 1.0
      };

      runAnimation(animationEvents.moveGametes, fatherPositions, opacity);

      // force a re-render 
      _this = this;
      _this.setState({animation:"running"});
    },2000);
  }

  componentDidUpdate() {
    setTimeout( () => {
      let fadeIns = document.getElementsByClassName("fade-in-on-render");
      for (let el of fadeIns) {
        el.classList.add("show");
      }
    }, 100);
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    gametes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onGameteChromosomeAdded: PropTypes.func.isRequired,
    onFertilize: PropTypes.func.isRequired,
    onAnimationStart: PropTypes.func,
    onAnimationEnd: PropTypes.func,
    challenge: PropTypes.number.isRequired
  }
  static authoredDrakesToDrakeArray = function(authoredChallenge) {
    return [authoredChallenge.mother, authoredChallenge.father];
  }
  static initialGametesArray = function() {
    return [{}, {}];
  }
}
