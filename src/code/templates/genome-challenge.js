import React, { Component, PropTypes } from 'react';
import OrganismGlowView from '../components/organism-glow';
import GenomeView from '../components/genome';
import ChangeSexButtons from '../components/change-sex-buttons';
import FeedbackView from '../components/feedback';

const userDrakeIndex   = 0,
      targetDrakeIndex = 1;

export default class GenomeChallengeTemplate extends Component {

  render() {
    const { drakes, chromosomeAlleleChange, sexChange, hiddenAlleles } = this.props,
          userDrakeDef = drakes[userDrakeIndex],
          targetDrakeDef = drakes[targetDrakeIndex],
          userDrake   = new BioLogica.Organism(BioLogica.Species.Drake, userDrakeDef.alleleString, userDrakeDef.sex),
          targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeDef.alleleString, targetDrakeDef.sex);

    const onAlleleChange = function(chrom, side, prevAllele, newAllele) {
      chromosomeAlleleChange([userDrakeIndex], chrom, side, prevAllele, newAllele);
    };
    const onSexChange = function(newSex) {
      sexChange([userDrakeIndex], newSex);
    };

    return (
      <div id="genome-challenge">
        <div className='column'>
          <div id="target-drake-label" className="column-label">Target Drake</div>
          <OrganismGlowView id="target-drake" org={ targetDrake } />
          <FeedbackView id='trial-feedback' className='feedback-view'
                                text={["TRIAL", `${this.props.trial} of __`]}/>
          <FeedbackView id='goal-feedback' className='feedback-view'
                                text={[`GOAL is __ MOVES`,
                                        `Your moves: ${this.props.moves}`]}/>
        </div>
        <div id="center-column" className='column'>
          <div id="your-drake-label" className="column-label">Your Drake</div>
          <OrganismGlowView org={ userDrake } id="your-drake" />
          <ChangeSexButtons id="change-sex-buttons" sex={ userDrake.sex } onChange= { onSexChange } showLabel={false} species="Drake"/>
        </div>
        <div className='column'>
          <div id="your-drake-label" className="column-label">Chromosome Control</div>
          <GenomeView org={ userDrake } onAlleleChange={ onAlleleChange } hiddenAlleles= { hiddenAlleles } />
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    chromosomeAlleleChange: PropTypes.func.isRequired,
    sexChange: PropTypes.func.isRequired,
    trial: PropTypes.number.isRequired,
    moves: PropTypes.number.isRequired
  };

  static authoredDrakesToDrakeArray = function(auth) {
    return [auth.initialDrake, auth.targetDrake];
  }
}
