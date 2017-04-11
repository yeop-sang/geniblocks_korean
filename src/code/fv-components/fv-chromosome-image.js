import React, {PropTypes} from 'react';
import classNames from 'classnames';

const FVChromosomeImageView = ({small=false, bold=false, empty=false, chromosomeId, animationStyling}) => {
  function chromosomeIdToClass(chromosomeId) {
    if (!chromosomeId) {
      return null;
    } else if (chromosomeId.endsWith('XYy')) {
      return 'yChromosome';
    } else if (chromosomeId.indexOf('x') > -1) {
      return 'xChromosome';
    } else if (chromosomeId.indexOf('1') > -1) {
      return 'one';
    } else if (chromosomeId.indexOf('2') > -1) {
      return 'two';
    }
    // Default case, may be no ID for empty chromosomes
    return null;
  }

  let positionStyling = {};
  if (animationStyling){
    positionStyling = {
      position: 'fixed', left: animationStyling.x, top: animationStyling.y, opacity: animationStyling.opacity
    };
  }
  return (
    <div className={classNames('fv-chromosome-image', chromosomeIdToClass(chromosomeId), { 'empty': empty, 'bold': bold,'small': small})} style={positionStyling}>
    </div>
  );
};

FVChromosomeImageView.propTypes = {
  chromosomeId: PropTypes.string,
  split: PropTypes.number,
  color: PropTypes.string,
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
