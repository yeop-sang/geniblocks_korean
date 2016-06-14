import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ChangeSexButtons from '../components/change-sex-buttons';

export default class GenomeChallengeTemplate extends Component {

  render() {
    const { drakes, chromosomeAlleleChange, sexChange, hiddenAlleles } = this.props,
          targetDrakeDef = drakes[0][0],
          userDrakeDef = drakes[0][1],
          targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeDef.alleleString, targetDrakeDef.sex),
          userDrake   = new BioLogica.Organism(BioLogica.Species.Drake, userDrakeDef.alleleString, userDrakeDef.sex);

    const onAlleleChange = function(chrom, side, prevAllele, newAllele) {
      chromosomeAlleleChange([0,1], chrom, side, prevAllele, newAllele);
    };
    const onSexChange = function(newSex) {
      sexChange([0,1], newSex);
    };

    return (
      <div>
        <div className='column'>
          <div id="target-drake-label" className="column-label">Target Drake</div>
          <OrganismView org={ targetDrake } />
        </div>
        <div  className='column'>
          <div id="your-drake-label" className="column-label">Your Drake</div>
          <OrganismView org={ userDrake } />
          <ChangeSexButtons id="change-sex-buttons-playground" sex={ userDrake.sex } onChange= { onSexChange } showLabel={false} species="Drake"/>
        </div>
        <div  className='column'>
          <GenomeView org={ userDrake } onAlleleChange={ onAlleleChange } hiddenAlleles= { hiddenAlleles } />
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    chromosomeAlleleChange: PropTypes.func.isRequired,
    sexChange: PropTypes.func.isRequired
  };
}
