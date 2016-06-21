import React, { Component, PropTypes } from 'react';
import OrganismGlowView from '../components/organism-glow';
import GenomeView from '../components/genome';
import ChangeSexButtons from '../components/change-sex-buttons';
import FeedbackView from '../components/feedback';
import ButtonView from '../components/button';
import GeneticsUtils from '../utilities/genetics-utils';

const userDrakeIndex   = 0,
      targetDrakeIndex = 1;

export default class GenomeChallengeTemplate extends Component {

  render() {
    const { drakes, onChromosomeAlleleChange, onSexChange, onDrakeSubmission, hiddenAlleles, userDrakeHidden } = this.props,
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
      onDrakeSubmission(targetDrake.phenotype.characteristics, userDrake.phenotype.characteristics, correct);
    };

    const userDrakeStyle = userDrakeHidden ? "hiddenDrake" : "";

    return (
      <div id="genome-challenge">
        <div className='column'>
          <div id="target-drake-label" className="column-label">Target Drake</div>
          <OrganismGlowView id="target-drake" org={ targetDrake } />
          <FeedbackView id='trial-feedback' className='feedback-view'
                                text={["TRIAL", `${this.props.trial} of __`]}/>
          <FeedbackView id='goal-feedback' className='feedback-view'
                                text={[`GOAL is ${this.props.goalMoves} MOVES`,
                                        `Your moves: ${this.props.moves}`]}/>
        </div>
        <div id="center-column" className='column'>
          <div id="your-drake-label" className="column-label">Your Drake</div>
          <OrganismGlowView org={ userDrake } id="your-drake" className={userDrakeStyle} />
          <ChangeSexButtons id="change-sex-buttons" sex={ userDrake.sex } onChange= { handleSexChange } showLabel={false} species="Drake"/>
        </div>
        <div className='column'>
          <div id="your-drake-label" className="column-label">Chromosome Control</div>
          <GenomeView org={ userDrake } onAlleleChange={ handleAlleleChange } hiddenAlleles= { hiddenAlleles } />
          <ButtonView label="Check Drake" onClick={ handleSubmit } />
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    trial: PropTypes.number.isRequired,
    moves: PropTypes.number.isRequired,
    goalMoves: PropTypes.number.isRequired,
    userDrakeHidden: PropTypes.bool.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired,
    onDrakeSubmission: PropTypes.func.isRequired
  }

  static authoredDrakesToDrakeArray = function(auth) {
    return [auth.initialDrake, auth.targetDrake];
  }

  static calculateGoalMoves = function(drakesArray) {
    let [initial, target] = drakesArray;
    return GeneticsUtils.numberOfChangesToReachPhenotype(initial, target);
  }
}
