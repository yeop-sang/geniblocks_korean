import React, {PropTypes} from 'react';
import classNames from 'classnames';

const FVChromosomeImageView = ({small=false, bold=false, empty=false, yChromosome=false, xChromosome=false, animationStyling}) => {
  let positionStyling = {};
  if (animationStyling){
    positionStyling = {
      position: 'fixed', left: animationStyling.x, top: animationStyling.y, opacity: animationStyling.opacity
    };
  }
  return (
    <div className={classNames('fv-chromosome-image', { 'empty': empty, 'bold': bold, 'yChromosome': yChromosome, 'xChromosome': xChromosome, 'small': small})} style={positionStyling}>
    </div>
  );
};

FVChromosomeImageView.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  split: PropTypes.number,
  color: PropTypes.string,
  small: PropTypes.bool,
  bold: PropTypes.bool,
  empty: PropTypes.bool,
  xChromosome: PropTypes.bool,
  yChromosome: PropTypes.bool,
  animationStyling: PropTypes.shape({
                      x: PropTypes.number,
                      y: PropTypes.number,
                      opacity: PropTypes.number
                    })
};

export default FVChromosomeImageView;
