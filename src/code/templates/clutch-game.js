import React, { Component, PropTypes } from 'react';
import { assign } from 'lodash';
import classNames from 'classnames';
import ParentDrakeView from '../fv-components/parent-drake';
import GenomeView from '../components/genome';
import BreedButtonAreaView from '../fv-components/breed-button-area';
import ClutchView from '../components/clutch-view';
import OrganismView from '../components/organism';
import FVChromosomeImageView from '../fv-components/fv-chromosome-image';

const durationHatchAnimation = 1333;  // msec

var timers = [];
function clearTimeouts() {
  for (let timer of timers) {
    clearTimeout(timer);
  }
}

var _this,
  animatedComponents = [],
  changeableDrakeType = "",

  hatchSoundPlayed = false,
  timerSet = null;

var animationEvents = {
  hatch: { id: 7, inProgress: false, complete: false,
    animate: function() {
      animationEvents.hatch.inProgress = true;
      animationEvents.hatch.complete = false;
      hatchSoundPlayed = false;
      _this.setState({hatchStarted:true});
    },
    onFinish: function() {
      animationEvents.hatch.complete = true;
      _this.setState({animation:"complete"});
    }
  }

};

/**
  @param {Object}   options
  @param {boolean}  options.clearAnimatedComponents - whether to clear the animatedComponents array (default: false)
  @param {Object}   options.reactState - React state to set (default: { animation: 'complete' })
 */
function resetAnimationEvents(options = {}){
  if (timerSet) timerSet.reset();
  clearTimeouts();
  animationEvents.hatch.inProgress = false;
  animationEvents.hatch.complete = false;
  if (options.clearAnimatedComponents) animatedComponents = [];
  if (_this) _this.setState(assign({ animation: 'complete' }, options.reactState));
}

export default class ClutchGame extends Component {

  static backgroundClasses = 'fv-layout fv-layout-c layout-b'

  componentWillMount() {
    _this = this;
    resetAnimationEvents({ showHatchAnimation: true,
                          clearAnimatedComponents: true,
                          reactState: {
                            animation: "complete"
                          } });
  }

  componentWillReceiveProps(nextProps) {
    const { routeSpec: prevRouteSpec, trial: prevTrial } = this.props,
          { level: prevLevel, mission: prevMission, challenge: prevChallenge } = prevRouteSpec,
          { routeSpec: nextRouteSpec, trial: nextTrial } = nextProps,
          { level: nextLevel, mission: nextMission, challenge: nextChallenge } = nextRouteSpec,
          newChallenge = (prevLevel !== nextLevel) || (prevMission !== nextMission) || (prevChallenge !== nextChallenge),
          newTrialInChallenge = !newChallenge && (prevTrial !== nextTrial);

    if (newChallenge || newTrialInChallenge ) {
      if (newChallenge) {
        this.setState({ animation: "complete" });
      }
      resetAnimationEvents({ showHatchAnimation: true,
                            clearAnimatedComponents: true });
    }
  }

  render() {
    const { scale, drakes, hiddenAlleles,
            userChangeableGenes, visibleGenes, onChromosomeAlleleChange,
            onBreedClutch, onHatch, onDrakeSubmission } = this.props,
          targetDrake = drakes[2], // 0: mother, 1: father, 2: target, 3...: children
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);

    let child = null;

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele, orgName) {
      let index = orgName === "mother" ? 0 : 1;
      onChromosomeAlleleChange(index, chrom, side, prevAllele, newAllele);
    };
    const handleFertilize = function() {
      animatedComponents = [];
      onBreedClutch(8);
    };

    const handleHatch = function () {
      if (!hatchSoundPlayed) {
        onHatch();
        hatchSoundPlayed = true;
      }
    };

    const handleSubmit = function (index, id, child) {
      let childImage = child.getImageName(),
          success = false;

      const targetDrakeOrg = new BioLogica.Organism(BioLogica.Species.Drake,
                                                    targetDrake.alleleString,
                                                    targetDrake.sex);
      success = (childImage === targetDrakeOrg.getImageName());
      onDrakeSubmission(2, index, success);
    };

    const targetDrakeOrg = targetDrake && targetDrake.alleleString
                              ? new BioLogica.Organism(BioLogica.Species.Drake,
                                                        targetDrake.alleleString,
                                                        targetDrake.sex)
                              : null,
          targetDrakeSection = <div className='geniblocks target-drake-container'>
                                 <OrganismView org={targetDrakeOrg} width={170}/>
                                 <div className="target-drake-text">Target Drake</div>
                               </div>;
    if (child && animationEvents.hatch.complete) {
      handleHatch();
    }

    let clutchDrakes = drakes.slice(3);
    clutchDrakes = clutchDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));
    let penView = <div className='columns bottom'>
                <ClutchView orgs={ clutchDrakes } width={500} onClick={handleSubmit}/>
              </div>;

    const parentGenomeClass = classNames('parent');

    function parentGenomeView(sex) {
      const org = sex === BioLogica.FEMALE ? mother : father,
            uniqueProps = sex === BioLogica.FEMALE
                              ? { orgName: 'mother', 
                                  editable: changeableDrakeType === "mother" || changeableDrakeType === "all"}
                              : { orgName: 'father', 
                                  editable: changeableDrakeType === "father" || changeableDrakeType === "all"};
      return <GenomeView className={parentGenomeClass}  species={org.species} org={org} {...uniqueProps}
                         ChromosomeImageClass={FVChromosomeImageView} small={ true } hiddenAlleles={hiddenAlleles}
                         userChangeableGenes={ visibleGenes } visibleGenes={ userChangeableGenes } onAlleleChange={ handleAlleleChange } 
                         chromosomeHeight={122} />;
    }

    return (
      <div id="egg-game">
        <div className="columns centered">
          <div className='column'>
            <ParentDrakeView className="mother" org={ mother } />
            { parentGenomeView(BioLogica.FEMALE) }
          </div>
          <div className='egg column'>
            <BreedButtonAreaView  scale={scale} isBreedButtonEnabled={true}
                                  isHatchingInProgress={false}
                                  hatchAnimationDuration={durationHatchAnimation}
                                  handleHatchingComplete={animationEvents.hatch.onFinish}
                                  isHatchingComplete={false}
                                  onBreed={handleFertilize} />
          </div>
          <div className='column'>
            <ParentDrakeView className="father" org={ father } />
            { parentGenomeView(BioLogica.MALE) }
          </div>
        </div>
        {penView}
        {targetDrakeSection}
        {animatedComponents}
      </div>
    );
  }

  componentWillUnmount() {
    _this = null;
    resetAnimationEvents();
  }

  static propTypes = {
    routeSpec: PropTypes.object.isRequired,
    scale: PropTypes.number,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onBreedClutch: PropTypes.func.isRequired,
    onHatch: PropTypes.func,
    onDrakeSubmission: PropTypes.func,
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge, authoredTrialNumber, trialNumber) {
    const changeableDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                                   authoredChallenge.changeableDrakes[authoredTrialNumber].alleles,
                                                   BioLogica.FEMALE),
          staticDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                               authoredChallenge.staticDrakes[authoredTrialNumber].alleles,
                                               BioLogica.FEMALE);
    changeableDrakeType = authoredChallenge.changeableDrakeType[trialNumber];
    let fatherSpec, motherSpec;
    if (changeableDrakeType === "mother") {
      motherSpec = { alleles: changeableDrake.getAlleleString(), sex: BioLogica.FEMALE };
      fatherSpec = { alleles: staticDrake.getAlleleString(), sex: BioLogica.MALE };
    } else {
      motherSpec = { alleles: staticDrake.getAlleleString(), sex: BioLogica.FEMALE };
      fatherSpec = { alleles: changeableDrake.getAlleleString(), sex: BioLogica.MALE };
    }
    return [motherSpec, fatherSpec, authoredChallenge.targetDrakes[authoredTrialNumber]];
  }

  static calculateGoalMoves = function() {
    // each incorrect submission counts as one move
    // the goal is to have no incorrect submissions
    return 0;
  }

}
