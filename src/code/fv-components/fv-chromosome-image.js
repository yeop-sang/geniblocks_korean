import React, {PropTypes} from 'react';
import FVGeneLabelView from './fv-gene-label';
import classNames from 'classnames';

/**
 * Returns a descriptive, but not necessarily unique, name of a given chromosome. Returns
 * null if no chromosome is given.
 * @param {object} chromosome - The chromosome which the returned name will describe
 */
export function getChromosomeDescriptor(chromosome) {
  return chromosome ? {name: chromosome.chromosome, side: chromosome.side} : null;
}

const FVChromosomeImageView = ({small=false, bold=false, empty=false, chromosomeDescriptor, animationStyling}) => {
  function chromosomeDescriptorToClass(chromosomeDescriptor) {
    if (!chromosomeDescriptor) {
      return null;
    } else if (chromosomeDescriptor.side === 'y') {
      return 'chromosome-y';
    } else if (chromosomeDescriptor.side === 'x') {
      return 'chromosome-x';
    } else if (chromosomeDescriptor.name === '1') {
      return 'chromosome-1';
    } else if (chromosomeDescriptor.name === '2') {
      return 'chromosome-2';
    }
    // Default case, no name for empty chromosomes
    return null;
  }

  let stripes = null;

  if (chromosomeDescriptor) {
    const alleles = BioLogica.Species.Drake.chromosomeGeneMap[chromosomeDescriptor.name];
    stripes = alleles.map(a => {
                return <FVGeneLabelView stripe={true} chromosomeDescriptor={chromosomeDescriptor} allele={a} />;
              });
  }

  let positionStyling = {};
  if (animationStyling){
    positionStyling = {
      position: 'fixed', left: animationStyling.x, top: animationStyling.y, opacity: animationStyling.opacity
    };
  }
  return (
    <div className={classNames('fv-chromosome-image', chromosomeDescriptorToClass(chromosomeDescriptor), { 'empty': empty, 'bold': bold,'small': small})} style={positionStyling}>
      {stripes}
    </div>
  );
};

FVChromosomeImageView.propTypes = {
  chromosomeDescriptor: PropTypes.object,
  small: PropTypes.bool,
  bold: PropTypes.bool,
  empty: PropTypes.bool,
  animationStyling: PropTypes.shape({
                      x: PropTypes.number,
                      y: PropTypes.number,
                      opacity: PropTypes.number
                    })
};

export default FVChromosomeImageView;
