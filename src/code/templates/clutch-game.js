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
    const { scale, challengeType, drakes, hiddenAlleles, hiddenParent, trial, numTargets,
      userChangeableGenes, visibleGenes, onChromosomeAlleleChange,
      onBreedClutch, onHatch, onDrakeSubmission, onParentSubmission, onReadyToAnswer } = this.props,
      // 0: mother, 1: father, 2...n: target, n+1...: children
      mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
      father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex),
      userDrake = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex),
      targetDrakes = drakes.slice(2, 2 + numTargets),
      isSubmitParents = challengeType === "submit-parents",
      isTestCross = challengeType === "test-cross",
      child = null;
      console.log(mother.getImageName(), father.getImageName(), userDrake.getImageName());

    const handleAlleleChange = function (chrom, side, prevAllele, newAllele, orgName) {
      const isHiddenParent = isTestCross && hiddenParent && ((hiddenParent.sex === BioLogica.FEMALE && orgName === "mother") || (hiddenParent.sex === BioLogica.MALE && orgName === "father")),
        incrementMoves = isTestCross ? isHiddenParent : !isSubmitParents,
        index = isHiddenParent ? 2 : orgName === "mother" ? 0 : 1;
      onChromosomeAlleleChange(index, chrom, side, prevAllele, newAllele, incrementMoves);
    };

    const handleFertilize = function () {
      animatedComponents = [];
      if (isTestCross) {
        onBreedClutch(12);
      } else {
        onBreedClutch(8);
      }
    };
    const handleReadyToAnswer = function () {
      onReadyToAnswer(true);
    };

    const handleSubmitParentGenotype = function () {
      const parent = hiddenParent.sex === BioLogica.FEMALE ? mother : father,
      success = (parent.getImageName() === userDrake.getImageName());

      //console.log(parent.getImageName(), userDrake.getImageName());

      onDrakeSubmission(2, 2, success, null, 0, 1);
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

    const handleSubmitParents = function () {
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
      const targetDrakeArray = Array(numTargets).fill().map((e, i) => i + 2);  // [2, ... n]
      onParentSubmission(0, 1, targetDrakeArray, success);
    };

    const targetSize = isSubmitParents ? 210 : 170;
    const targetText = isSubmitParents ? t("~TARGET.OFFSPRING") : t("~TARGET.TARGET_DRAKE");
    const targetDrakeViews = targetDrakes.map(d => {
      const org = new BioLogica.Organism(BioLogica.Species.Drake,
        d.alleleString,
        d.sex);
      return <OrganismView org={org} width={targetSize} />;
    });

    const targetDrakeSection = (!isTestCross && <div className='geniblocks target-drake-container'>
      <div className='drakes'>
        {targetDrakeViews}
      </div>
      <div className="target-drake-text">{targetText}</div>
    </div>
    );

    if (child && animationEvents.hatch.complete) {
      handleHatch();
    }

    let clutchDrakes = drakes.slice(2 + numTargets);
    clutchDrakes = clutchDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));
    const clickDrake = !isSubmitParents ? handleSubmit : null;
    let penView = (isTestCross ? <ClutchView orgs={clutchDrakes} pageSize={12} /> : <ClutchView orgs={clutchDrakes} width={250} onClick={clickDrake} />);

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

      const isHiddenParent = isTestCross && hiddenParent && (hiddenParent.sex === sex);
      const org = sex === BioLogica.FEMALE ? mother : father,
            uniqueProps = sex === BioLogica.FEMALE
                              ? { orgName: 'mother', className: motherClassNames, isHiddenParent }
          : { orgName: 'father', className: fatherClassNames, isHiddenParent };

      let view = isHiddenParent && hiddenParent.hiddenGenotype ?
        <div id="test-cross-guess">
          {testCross}
        </div> :
        <div id="genome-container">
          <GenomeView species={isHiddenParent ? userDrake.species : org.species} org={isHiddenParent ? userDrake : org} {...uniqueProps} editable={parentChangeableGenes.length > 0}
                         ChromosomeImageClass={FVChromosomeImageView} small={ true } hiddenAlleles={hiddenAlleles}
                         userChangeableGenes={ parentChangeableGenes } visibleGenes={ visibleGenes } onAlleleChange={ handleAlleleChange }
            chromosomeHeight={122} defaultUnknown={isHiddenParent}
          />
          {isHiddenParent &&
            <div>
              <div className='geniblocks test-cross-submit-button-surround'>
                <div className={classNames('test-cross-submit-button', 'geniblocks', 'fv-button')} onClick={handleSubmitParentGenotype}>
                  <div className="button-label unselectable">{t("~BUTTON.SUBMIT")}</div>
                </div>
              </div>
            </div>}
        </div>;
      return view;
    }

    function parentImageView(sex) {
      const org = sex === BioLogica.FEMALE ? mother : father,
        parentName = sex === BioLogica.FEMALE ? "mother" : "father",
        isHiddenParent = isTestCross && hiddenParent && hiddenParent.sex === sex,
        hiddenImage = isHiddenParent ? hiddenParent.hiddenImage : false;
      return <ParentDrakeView className={parentName} org={org} width={parentSize} hidden={hiddenImage} />;
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

    const testCross = isTestCross ?
      (
        <div id="test-cross-buttons">
          <div className="geniblocks ready-to-answer-button-area">
            <div className='geniblocks ready-to-answer-button-surround'>
              <div className={classNames('ready-to-answer-button', 'geniblocks', 'fv-button')} onClick={handleReadyToAnswer}>
                <div className="button-label unselectable">{t("~BUTTON.READY_TO_ANSWER")}</div>
              </div>
            </div>
          </div>
        </div>

      ) : null;

    return (
      <div id="breeding-game">
        <div className="columns centered">
          <div className='column'>
            {parentImageView(BioLogica.FEMALE)}
            {parentGenomeView(BioLogica.FEMALE)}
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
            {parentImageView(BioLogica.MALE)}
            {parentGenomeView(BioLogica.MALE)}
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
    hiddenParent: PropTypes.object,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onBreedClutch: PropTypes.func.isRequired,
    onHatch: PropTypes.func,
    onDrakeSubmission: PropTypes.func,
    onParentSubmission: PropTypes.func,
    onReadyToAnswer: PropTypes.func
  }

  static authoredDrakesToDrakeArray = function (authoredChallenge, authoredTrialNumber) {
    // allow for multiple targets
    if (authoredChallenge.challengeType === "submit-parents" &&
      Array.isArray(authoredChallenge.targetDrakes[authoredTrialNumber])) {
      return [authoredChallenge.mother[authoredTrialNumber],
      authoredChallenge.father[authoredTrialNumber]]
        .concat(authoredChallenge.targetDrakes[authoredTrialNumber]);
    } else if (authoredChallenge.challengeType === "test-cross") {
      let parentArray = authoredChallenge.hiddenParent.sex === BioLogica.FEMALE ? authoredChallenge.mother : authoredChallenge.father;
      let randomSelection = Math.floor(Math.random() * parentArray[0].randomMatched.length);
      let parent = parentArray[0].randomMatched[randomSelection];

      let userDrake = Object.assign({}, parent);
      let replaceRegex = new RegExp(authoredChallenge.targetDrake.alleles, "i");
      let newAlleles = userDrake.alleles.replace(replaceRegex, authoredChallenge.targetDrake.alleles );

      userDrake.alleles = newAlleles;

      let authoredDrakes =
        [ authoredChallenge.hiddenParent.sex === BioLogica.FEMALE ? parent: authoredChallenge.mother,
          authoredChallenge.hiddenParent.sex === BioLogica.FEMALE ? authoredChallenge.father : parent,
          userDrake ];
      return authoredDrakes;
    }
  }

  static getNumTargets = function(authoredChallenge, authoredTrialNumber) {
    if (authoredChallenge.challengeType === "submit-parents") {
      if (authoredChallenge.targetDrakes[authoredTrialNumber].randomMatched) {
        return authoredChallenge.targetDrakes[authoredTrialNumber].randomMatched[0].length;
      }
      return authoredChallenge.targetDrakes[authoredTrialNumber].length;
    }
    return 1;
  }

  static getHiddenParent = function(authoredChallenge) {
    if (authoredChallenge.challengeType === "test-cross") {
      if (authoredChallenge.hiddenParent) {
        return authoredChallenge.hiddenParent;
      }
    }
    return undefined;
  }

}
