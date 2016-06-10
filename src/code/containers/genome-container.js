import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';

export default class GenomeContainer extends Component {

  render() {
    const { drakes, index, onAlleleChange } = this.props,
          drakeDef = drakes[index[0]][index[1]],
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, 1);

    const alleleChange = function(chrom, side, prevAllele, newAllele) {
      onAlleleChange(index, chrom, side, prevAllele, newAllele);
    };

    return (
      <div>
        <div>
          <OrganismView org={ drake } />
        </div>
        <div>
          <GenomeView org={ drake } onAlleleChange={ alleleChange }/>
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    index: PropTypes.array.isRequired,
    onAlleleChange: PropTypes.func.isRequired
  };
}
