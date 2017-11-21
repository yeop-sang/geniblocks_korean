import React, { Component, PropTypes } from 'react';
import { assign } from 'lodash';
import classNames from 'classnames';
import ParentDrakeView from '../fv-components/parent-drake';
import GenomeView from '../components/genome';
import BreedButtonAreaView from '../fv-components/breed-button-area';
import ClutchView from '../components/clutch-view';
import OrganismView from '../components/organism';
import FVChromosomeImageView from '../fv-components/fv-chromosome-image';
import ButtonView from '../fv-components/button';
import t from '../utilities/translate';

const durationHatchAnimation = 1333;  // msec

var timers = [];
function clearTimeouts() {
  for (let timer of timers) {
    clearTimeout(timer);
  }
}

var _this,
  animatedComponents = [],

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

  static backgroundClasses = 'fv-layout fv-layout-h'

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
    const { scale, challengeType, drakes, hiddenAlleles, trial, numTargets,
            userChangeableGenes, visibleGenes, onChromosomeAlleleChange,
            onBreedClutch, onHatch, onDrakeSubmission, onParentSubmission } = this.props,
          // 0: mother, 1: father, 2...n: target, n+1...: children
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex),
          targetDrakes = drakes.slice(2, 2+numTargets),
          isSubmitParents = challengeType === "submit-parents";
    let child = null;

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele, orgName) {
      const index = orgName === "mother" ? 0 : 1,
            incrementMoves = !isSubmitParents;
      onChromosomeAlleleChange(index, chrom, side, prevAllele, newAllele, incrementMoves);
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
      const childImage = child.getImageName(),
            selectedDrakeIndex = index + 3,
            targetDrakeOrg = new BioLogica.Organism(BioLogica.Species.Drake,
                                                    targetDrakes[0].alleleString,
                                                    targetDrakes[0].sex),
            success = (childImage === targetDrakeOrg.getImageName());

      onDrakeSubmission(2, selectedDrakeIndex, success, null, 0, 1);
    };

    const handleSubmitParents = function() {
      const movesToMakeAllOffspring = targetDrakes.reduce((sum, t) => {
        const targetDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                              t.alleleString, t.sex);
        return sum + BioLogica.Organism.numberOfBreedingMovesToReachOrganism(
          mother,
          father,
          [],
          [],
          targetDrake
        );
      }, 0);
      const success = movesToMakeAllOffspring === 0;
      const targetDrakeArray = Array(numTargets).fill().map((e,i)=>i+2);  // [2, ... n]
      onParentSubmission(0, 1, targetDrakeArray, success);
    };

    const targetSize = isSubmitParents ? 210 : 170;
    const targetText = isSubmitParents ? t("~TARGET.OFFSPRING") : t("~TARGET.TARGET_DRAKE");
    const targetDrakeViews = targetDrakes.map(d => {
      const org = new BioLogica.Organism(BioLogica.Species.Drake,
                              d.alleleString,
                              d.sex);
      return <OrganismView org={org} width={targetSize}/>;
    });
    const targetDrakeSection = <div className='geniblocks target-drake-container'>
                                  <div className='drakes'>
                                    {targetDrakeViews}
                                  </div>
                                 <div className="target-drake-text">{targetText}</div>
                               </div>;
    if (child && animationEvents.hatch.complete) {
      handleHatch();
    }

    let clutchDrakes = drakes.slice(2+numTargets);
    clutchDrakes = clutchDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));
    const clickDrake = isSubmitParents ? handleSubmit : null;
    let penView = <ClutchView orgs={ clutchDrakes } width={250} onClick={clickDrake}/>;

    const motherClassNames = classNames('parent', 'mother'),
          fatherClassNames = classNames('parent', 'father');

    function parentGenomeView(sex) {
      let parentChangeableGenes;
      // Changeable genes are either of the form ["wings, legs"] or [{mother: ["wings"], father:[]}, {mother: [], father: ["wings"]}]
      if (userChangeableGenes[0].mother) {
        parentChangeableGenes = sex === BioLogica.FEMALE ? userChangeableGenes[trial].mother : userChangeableGenes[trial].father;
      } else {
        parentChangeableGenes = userChangeableGenes;
      }

      const org = sex === BioLogica.FEMALE ? mother : father,
            uniqueProps = sex === BioLogica.FEMALE
                              ? { orgName: 'mother', className: motherClassNames }
                              : { orgName: 'father', className: fatherClassNames };
      return <GenomeView species={org.species} org={org} {...uniqueProps} editable={parentChangeableGenes.length > 0}
                         ChromosomeImageClass={FVChromosomeImageView} small={ true } hiddenAlleles={hiddenAlleles}
                         userChangeableGenes={ parentChangeableGenes } visibleGenes={ visibleGenes } onAlleleChange={ handleAlleleChange }
                         chromosomeHeight={122} />;
    }

    const bottomButtons = isSubmitParents ?
      (
        <div id="bottom-buttons">
          <ButtonView
            text={t("~BUTTON.SUBMIT_PARENTS")}
            styleName="submit-parents-button"
            onClick={handleSubmitParents} />
        </div>
      ) : null;

    const parentSize = isSubmitParents ? 280 : 250;

    return (
      <div id="breeding-game">
        <div className="columns centered">
          <div className='column'>
            <ParentDrakeView className="mother" org={ mother } width={parentSize} />
            { parentGenomeView(BioLogica.FEMALE) }
          </div>
          <div className='column center-column'>
            {targetDrakeSection}
            {penView}
            <BreedButtonAreaView  scale={scale} isBreedButtonEnabled={true}
                                  isHatchingInProgress={false}
                                  hatchAnimationDuration={durationHatchAnimation}
                                  handleHatchingComplete={animationEvents.hatch.onFinish}
                                  isHatchingComplete={false}
                                  onBreed={handleFertilize} />
          </div>
          <div className='column'>
            <ParentDrakeView className="father" org={ father } width={parentSize} />
            { parentGenomeView(BioLogica.MALE) }
          </div>
        </div>
        {bottomButtons}
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
    challengeType: PropTypes.string.isRequired,
    scale: PropTypes.number,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    numTargets: PropTypes.number,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onBreedClutch: PropTypes.func.isRequired,
    onHatch: PropTypes.func,
    onDrakeSubmission: PropTypes.func,
    onParentSubmission: PropTypes.func
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge, authoredTrialNumber) {
    // allow for multiple targets
    if (Array.isArray(authoredChallenge.targetDrakes[authoredTrialNumber])) {
      return [authoredChallenge.mother[authoredTrialNumber],
              authoredChallenge.father[authoredTrialNumber]]
            .concat(authoredChallenge.targetDrakes[authoredTrialNumber]);
    }
    return [authoredChallenge.mother[authoredTrialNumber],
            authoredChallenge.father[authoredTrialNumber],
            authoredChallenge.targetDrakes[authoredTrialNumber]];
  }

  static getNumTargets = function(authoredChallenge, authoredTrialNumber) {
    if (Array.isArray(authoredChallenge.targetDrakes[authoredTrialNumber])) {
      return authoredChallenge.targetDrakes[authoredTrialNumber].length;
    }
    return 1;
  }

}
