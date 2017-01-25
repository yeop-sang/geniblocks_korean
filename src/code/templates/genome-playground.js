import React, { Component, PropTypes } from 'react';
import OrganismGlowView from '../components/organism-glow';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import ChangeSexButtons from '../components/change-sex-buttons';

export default class GenomeContainer extends Component {

  render() {
    const { drakes, onChromosomeAlleleChange, onSexChange, onCompleteChallenge, userChangeableGenes, visibleGenes } = this.props,
          drakeDef = drakes[0].alleleString,
          drakeSex = drakes[0].sex,
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, drakeSex);

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
      onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
    };

    const handleSexChange = function(newSex) {
      onSexChange(0, newSex);
    };

    const handleAdvanceChallenge = function() {
      onCompleteChallenge();
    };

    return (
      <div id="genome-playground">
        <div className='column'>
            <ChangeSexButtons id="change-sex-buttons" sex={ drakeSex } onChange= { handleSexChange } showLabel={true} species="Drake" />
            <GenomeView className="drake-genome" org={ drake } onAlleleChange={ handleAlleleChange } userChangeableGenes= { userChangeableGenes } visibleGenes={ visibleGenes }/>
        </div>
        <div className='column'>
            <OrganismGlowView id="drake-image" org={ drake } />
            <ButtonView label="~BUTTON.PLAYGROUND_MOVE_FORWARD" id="advance-button" onClick={ handleAdvanceChallenge } />
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired,
    onCompleteChallenge: PropTypes.func.isRequired
  }

  static authoredDrakesToDrakeArray = function(auth) {
    return [auth.initialDrake];
  }
}
