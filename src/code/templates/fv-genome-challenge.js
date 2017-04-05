import React, { PropTypes } from 'react';
import OrganismGlowView from '../components/organism-glow';
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
const HatchDrakeButton = ({onClick, disabled}) => {

  function handleClick() {
    onClick();
  }

  const hatchDrakeLabel = t('~FV_GENOME_CHALLENGE.HATCH_DRAKE_BUTTON_LABEL');
  return (
    <div className={classNames('hatch-drake-button', {disabled})} onClick={handleClick}>
      <div className="button-label hatch-drake-button-label unselectable">
        {hatchDrakeLabel}
      </div>
    </div>
  );
};

HatchDrakeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

/*
 * YourDrakeView
 */
class YourDrakeView extends React.Component {

  static propTypes = {
    org: PropTypes.object,
    className: PropTypes.string
  }

  render() {
    const { org, className } = this.props;
    return (
      <div className='your-drake-surround'>
        <OrganismGlowView org={org} id="your-drake" className={className} />
      </div>
    );
  }
}

/*
 * TargetDrakeView
 */
class TargetDrakeView extends React.Component {

  static propTypes = {
    org: PropTypes.object
  }

  render() {
    const { org } = this.props;
    return (
      <div className='target-drake-gizmo'>
        <div id="target-drake-label">Target Drake</div>
        <OrganismGlowView id="target-drake" org={org} />
      </div>
    );
  }
}

/*
 * FVGenomeChallenge
 */
export default class FVGenomeChallenge extends React.Component {

  static backgroundClasses = 'fv-layout fv-layout-a'

  render() {
    const { drakes, onChromosomeAlleleChange, onSexChange, onDrakeSubmission,
            userChangeableGenes, visibleGenes, hiddenAlleles, showUserDrake, userDrakeHidden } = this.props,
          userDrakeDef = drakes[userDrakeIndex],
          targetDrakeDef = drakes[targetDrakeIndex],
          userDrake   = new BioLogica.Organism(BioLogica.Species.Drake, userDrakeDef.alleleString, userDrakeDef.sex),
          targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeDef.alleleString, targetDrakeDef.sex);

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

    const userDrakeStyle = !showUserDrake && userDrakeHidden ? "hiddenDrake" : "";

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
          <YourDrakeView org={ userDrake } className={userDrakeStyle} />
          <HatchDrakeButton onClick={ handleSubmit } />
        </div>
        <div id='right-column' className='column'>
          <TargetDrakeView org={ targetDrake } />
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
