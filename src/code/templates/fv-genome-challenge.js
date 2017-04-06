import React, { PropTypes } from 'react';
import EggHatchDrakeView from '../fv-components/egg-hatch-drake';
import AnimatedSprite from '../components/animated-sprite';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ChangeSexButtons from '../components/change-sex-buttons';
import GeneticsUtils from '../utilities/genetics-utils';
import { generateTrialDrakes } from '../utilities/trial-generator';
import classNames from 'classnames';
import t from '../utilities/translate';

const userDrakeIndex   = 0,
      targetDrakeIndex = 1;

/*
 * HatchDrakeButton
 */
const HatchDrakeButton = ({label, onClick, disabled}) => {

  function handleClick() {
    onClick();
  }

  return (
    <div className={classNames('hatch-drake-button', {disabled})} onClick={handleClick}>
      <div className="button-label hatch-drake-button-label unselectable">
        {label}
      </div>
    </div>
  );
};

HatchDrakeButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

/*
 * YourDrakeView
 */
class YourDrakeView extends React.Component {

  static propTypes = {
    org: PropTypes.object,
    className: PropTypes.string,
    hatchStarted: PropTypes.bool,
    hatchComplete: PropTypes.bool,
    onHatchComplete: PropTypes.func
  }

  render() {
    const { org, className, hatchStarted, hatchComplete, onHatchComplete } = this.props;
    return (
      <div className='your-drake-surround'>
        <EggHatchDrakeView drake={org} id="your-drake" className={className}
                            hatchStarted={hatchStarted} hatchComplete={hatchComplete}
                            onHatchComplete={onHatchComplete}
                            width={300} />
      </div>
    );
  }
}

/*
 * TargetDrakeView
 */
class TargetDrakeView extends React.Component {

  static propTypes = {
    showIntro: PropTypes.bool,
    org: PropTypes.object
  }

  state = {
    introComplete: false
  }

  handleIntroComplete = () => {
    this.setState({ introComplete: true });
  }

  render() {
    const { showIntro, org } = this.props,
          { introComplete } = this.state,
          completeDisplayStyle = { display: showIntro && !introComplete ? 'none' : 'flex' },
          introAnimation = <AnimatedSprite
                              classNames='target-gizmo-animation'
                              frames={5} frameWidth={915} duration={1600}
                              onEnd={this.handleIntroComplete} />,
          // instantiating with {display:none} allows images to preload during animation
          completeView = <div className='target-drake-gizmo' style={completeDisplayStyle}>
                            <div id="target-drake-label">Target Drake</div>
                            <OrganismView id="target-drake" org={org} width={300} />
                          </div>;
    return (
      <div className='target-drake-view'>
        { showIntro && !introComplete ? introAnimation : null }
        { completeView }
      </div>
    );
  }
}

/*
 * FVGenomeChallenge
 */
export default class FVGenomeChallenge extends React.Component {

  static backgroundClasses = 'fv-layout fv-layout-a'

  state = {
    hatchStarted: false
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showUserDrake && !this.props.userDrakeHidden && nextProps.userDrakeHidden)
      this.setState({ hatchStarted: false });
  }

  render() {
    const { drakes, onChromosomeAlleleChange, onSexChange, onDrakeSubmission,
            userChangeableGenes, visibleGenes, hiddenAlleles, showUserDrake } = this.props,
          userDrakeDef = drakes[userDrakeIndex],
          checkHatchButtonLabel = showUserDrake
                                    ? t('~FV_GENOME_CHALLENGE.CHECK_DRAKE_BUTTON_LABEL')
                                    : t('~FV_GENOME_CHALLENGE.HATCH_DRAKE_BUTTON_LABEL'),
          targetDrakeDef = drakes[targetDrakeIndex],
          userDrake   = new BioLogica.Organism(BioLogica.Species.Drake, userDrakeDef.alleleString, userDrakeDef.sex),
          targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeDef.alleleString, targetDrakeDef.sex),
          this_ = this;

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
      onChromosomeAlleleChange(userDrakeIndex, chrom, side, prevAllele, newAllele);
    };
    const handleSexChange = function(newSex) {
      onSexChange(userDrakeIndex, newSex);
    };
    const handleSubmit = function() {
      let correct = targetDrake.getImageName() === userDrake.getImageName();
      onDrakeSubmission(targetDrakeIndex, userDrakeIndex, correct);
    };
    const handleCheckHatchButton = function() {
      if (showUserDrake)
        handleSubmit();
      else
        this_.setState({ hatchStarted: true });
    };

    return (
      <div id="genome-challenge">
        <div id='left-column' className='column'>
          <GenomeView org={ userDrake } onAlleleChange={ handleAlleleChange } userChangeableGenes= { userChangeableGenes } visibleGenes={ visibleGenes } hiddenAlleles={ hiddenAlleles }/>
          <ChangeSexButtons id="change-sex-buttons" sex={ userDrake.sex } onChange= { handleSexChange } showLabel={false} species="Drake"/>
        </div>
        <div id="center-column" className='column'>
          <div className='label-container'>
            <div id="your-drake-label" className="column-label">Your Drake</div>
          </div>
          <YourDrakeView org={ userDrake }
                          hatchStarted={this.state.hatchStarted || showUserDrake}
                          hatchComplete={showUserDrake}
                          onHatchComplete={handleSubmit} />
          <HatchDrakeButton label={checkHatchButtonLabel} onClick={ handleCheckHatchButton } />
        </div>
        <div id='right-column' className='column'>
          <TargetDrakeView showIntro={true} org={ targetDrake } />
        </div>
      </div>
    );
  }

  static propTypes = {
    instructions: PropTypes.string,
    drakes: PropTypes.array.isRequired,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    trial: PropTypes.number.isRequired,
    trials: PropTypes.array.isRequired,
    moves: PropTypes.number.isRequired,
    goalMoves: PropTypes.number.isRequired,
    showUserDrake: PropTypes.bool,
    userDrakeHidden: PropTypes.bool.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired,
    onDrakeSubmission: PropTypes.func.isRequired
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge, trial) {
    if (authoredChallenge.trialGenerator) {
      return generateTrialDrakes(authoredChallenge.trialGenerator, trial);
    } else if (Array.isArray(authoredChallenge.initialDrake)) {
      return [authoredChallenge.initialDrake[trial], authoredChallenge.targetDrakes[trial]];
    } else {
      return [authoredChallenge.initialDrake, authoredChallenge.targetDrakes[trial]];
    }
  }

  static calculateGoalMoves = function(drakesArray) {
    let [initial, target] = drakesArray;
    return GeneticsUtils.numberOfChangesToReachPhenotype(initial, target);
  }

  static logState = function(state) {
    return {
      initialDrake: state.drakes[0],
      targetDrake: state.drakes[1],
      goalMoves: state.goalMoves,
      trials: state.trials.length,
      trial: state.trial
    };
  }
}
