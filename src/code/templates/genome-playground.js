import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import ChangeSexButtons from '../components/change-sex-buttons';

export default class GenomeContainer extends Component {

  render() {
    const { drakes, chromosomeAlleleChange, sexChange, navigateNextChallenge, hiddenAlleles } = this.props,
          drakeDef = drakes[0][0].alleleString,
          drakeSex = drakes[0][0].sex,
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, drakeSex);

    const onAlleleChange = function(chrom, side, prevAllele, newAllele) {
      chromosomeAlleleChange([0,0], chrom, side, prevAllele, newAllele);
    };

    const onSexChange = function(newSex) {
      sexChange([0,0], newSex);
    };

    const onAdvanceChallenge = function() {
      navigateNextChallenge();
    };

    return (
      <div>
        <div className='column'>
          <div>
            <OrganismView org={ drake } />
          </div>
        </div>
        <div className='column'>    
          <div>
            <ChangeSexButtons id="change-sex-buttons-playground" sex={ drakeSex } onChange= { onSexChange } showLabel={true} species="Drake" />
          </div>
          <div>
            <GenomeView className='parent-genome' org={ drake } onAlleleChange={ onAlleleChange } hiddenAlleles= { hiddenAlleles } />
          </div>
          <div>
            <ButtonView label="Bring It On!" onClick={ onAdvanceChallenge } />
          </div>
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    chromosomeAlleleChange: PropTypes.func.isRequired,
    sexChange: PropTypes.func.isRequired,
    navigateNextChallenge: PropTypes.func.isRequired
  };
}
