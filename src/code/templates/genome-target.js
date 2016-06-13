import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';

export default class GenomeTargetTemplate extends Component {

  render() {
    const { drakes, chromosomeAlleleChange } = this.props,
          targetDrakeDef = drakes[0][0],
          userDrakeDef = drakes[0][1],
          targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeDef.alleleString, targetDrakeDef.sex),
          userDrake   = new BioLogica.Organism(BioLogica.Species.Drake, userDrakeDef.alleleString, userDrakeDef.sex);

    const onAlleleChange = function(chrom, side, prevAllele, newAllele) {
      chromosomeAlleleChange([0,1], chrom, side, prevAllele, newAllele);
    };

    return (
      <div>
        <div>
          <OrganismView org={ targetDrake } />
        </div>
        <div>
          <OrganismView org={ userDrake } />
        </div>
        <div>
          <GenomeView org={ userDrake } onAlleleChange={ onAlleleChange }/>
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    chromosomeAlleleChange: PropTypes.func.isRequired
  };
}
