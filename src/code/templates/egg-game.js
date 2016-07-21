import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import PenView from '../components/pen';
import { transientStateTypes } from '../actions';
import AnimatedComponentView from '../components/animated-component';
import ChromosomeImageView from '../components/chromosome-image';

// a "reasonable" lookup function
function lookupGameteChromosomeDOMElement(org, chromosomeName) {
  let wrapperId = org.sex === 0 ? "father-gamete-genome" : "mother-gamete-genome",
      wrapper = document.getElementById(wrapperId),
      chromosomePositions = {"1": 0, "2": 1, "XY": 2};
  return wrapper.querySelectorAll(".chromosome-image")[chromosomePositions[chromosomeName]];
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

var animatedComponents = [], animatedChromosome, startDisplay, targetDisplay, lastComponentId=0;
function updateAnimationPositions(positions, el){
  startDisplay = {
    startPositionRect: positions.startPositionRect,
    opacity: 1.0
  };
  targetDisplay = {
    targetPositionRect: positions.targetPositionRect,
    opacity: 0.0
  };
  let targetIsY = el.getElementsByClassName("chromosome-allele-container")[0].id.endsWith('XYy');
  animatedChromosome = <ChromosomeImageView small={true} empty={false} bold={false} yChromosome={targetIsY}/>;
  animatedComponents.push(<AnimatedComponentView key={lastComponentId} viewObject={animatedChromosome} startDisplay={startDisplay} targetDisplay={targetDisplay} runAnimation={true} onRest={animationFinish} />);
  lastComponentId++;
}

function animationFinish(){
  // remove older components?
  // animatedComponents.shift();
}


export default class EggGame extends Component {
    render() {
      const { drakes, gametes, onChromosomeAlleleChange, onGameteChromosomeAdded, onFertilize, onResetGametes, onKeepOffspring, hiddenAlleles, transientStates } = this.props,
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
        let positions = findBothElements(org, name, el);
        updateAnimationPositions(positions, el);
        onGameteChromosomeAdded(org.sex, name, side);
      };
      const handleFertilize = function() {
        if (Object.keys(gametes[0]).length === 3 && Object.keys(gametes[1]).length === 3) {
          animatedComponents = [];
          onFertilize(2000, 0, 1);
        }
      };
      const handleKeepOffspring = function() {
        let childImage = child.getImageName(),
            [,,,...keptDrakes] = drakes,
            success = true;
        for (let drake of keptDrakes) {
          let org = new BioLogica.Organism(BioLogica.Species.Drake, drake.alleleString, drake.sex);
          if (org.getImageName() === childImage) {
            success = false;
            break;
          }
        }
        onKeepOffspring(2, success);
      };
      const handleReset = function() {
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

      var ovumView, spermView;
      if ((transientStates.length === 0 && !drakes[2]) ||  transientStates.indexOf(transientStateTypes.FERTILIZING) > -1) {
        ovumView  = <img className="ovum" src="resources/images/egg.svg" />;
        spermView = <img className="sperm" src="resources/images/sperm.svg" />;
      }

      let [,,,...keptDrakes] = drakes;
      keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));


      return (
      <div id="egg-game">
        <div className="columns">
          <div className='column'>
            <div>Mother</div>
              <OrganismView org={ mother } flipped={ true }/>
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
            <div>Father</div>
              <OrganismView org={ father } />
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

  componentDidUpdate() {
    setTimeout( () => {
      let fadeIns = document.getElementsByClassName("fade-in-on-render");
      for (let el of fadeIns) {
        el.classList.add("show");
      }
    }, 1);
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    gametes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onGameteChromosomeAdded: PropTypes.func.isRequired,
    onFertilize: PropTypes.func.isRequired,
    challenge: PropTypes.number.isRequired
  }
  static authoredDrakesToDrakeArray = function(authoredChallenge) {
    return [authoredChallenge.mother, authoredChallenge.father];
  }
  static initialGametesArray = function() {
    return [{}, {}];
  }
}
