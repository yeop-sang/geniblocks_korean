import React, { Component, PropTypes } from 'react';
import OrganismGlowView from '../components/organism-glow';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import ChangeSexButtons from '../components/change-sex-buttons';

export default class GenomeContainer extends Component {

  render() {
    const { drakes, chromosomeAlleleChange, sexChange, navigateNextChallenge, hiddenAlleles } = this.props,
          drakeDef = drakes[0].alleleString,
          drakeSex = drakes[0].sex,
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, drakeSex);

    const onAlleleChange = function(chrom, side, prevAllele, newAllele) {
      chromosomeAlleleChange([0], chrom, side, prevAllele, newAllele);
    };

    const onSexChange = function(newSex) {
      sexChange([0], newSex);
    };

    const onAdvanceChallenge = function() {
      navigateNextChallenge();
    };

    return (
      <div id="genome-playground">
        <div className='column'>
          <div>
            <ChangeSexButtons id="change-sex-buttons" sex={ drakeSex } onChange= { onSexChange } showLabel={true} species="Drake" />
          </div>
          <div>
            <GenomeView className="drake-genome" org={ drake } onAlleleChange={ onAlleleChange } hiddenAlleles= { hiddenAlleles } />
          </div>
        </div>
        <div className='column'>
          <div>
            <OrganismGlowView id="drake-image" org={ drake } />
          </div>
          <div>
            <ButtonView label="Bring It On!" id="advance-button" onClick={ onAdvanceChallenge } />
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

  static authoredDrakesToDrakeArray = function(auth) {
    return [auth.initialDrake];
  }
}
