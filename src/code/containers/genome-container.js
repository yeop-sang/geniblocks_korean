import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ChangeSexButtons from '../components/change-sex-buttons';

export default class GenomeContainer extends Component {

  render() {
    const { drakes, index, onAlleleChange, onSexChange } = this.props,
          drakeDef = drakes[index[0]][index[1]].alleleString,
          drakeSex = drakes[index[0]][index[1]].sex,
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, drakeSex);

    const alleleChange = function(chrom, side, prevAllele, newAllele) {
      onAlleleChange(index, chrom, side, prevAllele, newAllele);
    };

    const sexChange = function(newSex) {
      onSexChange(index, newSex);
    };

    return (
      <div>
        <div>
          <OrganismView org={ drake } />
        </div>
        <div>
          <ChangeSexButtons sex={ drakeSex } onChange= { sexChange } />
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
    onAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired
  };
}
