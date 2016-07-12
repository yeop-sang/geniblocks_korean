import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

const AnimatedComponentView = ({viewObject, springiness = 100, damping = 30, startDisplay, targetDisplay, runAnimation, onRest}) => {

  if (!runAnimation) return null;
  if (!startDisplay || !targetDisplay) return null;

  const springConfig = { stiffness: springiness, damping: damping };

  let startStyle = {}, endStyle = {};
  if (startDisplay.startPositionRect) {
    startStyle.left = startDisplay.startPositionRect.left;
    startStyle.top = startDisplay.startPositionRect.top;
  }
  if (startDisplay.opacity != null){
    startStyle.opacity = startDisplay.opacity;
  }

  if (targetDisplay.targetPositionRect) {
    endStyle.left = spring(targetDisplay.targetPositionRect.left, springConfig);
    endStyle.top = spring(targetDisplay.targetPositionRect.top, springConfig);
  }
  if (targetDisplay.opacity != null) {
    endStyle.opacity = spring(targetDisplay.opacity, springConfig);
  }

  const onAnimationFinished = () => {
    onRest();
  };

  return (
    <Motion className='geniblocks animated-component-view'
          defaultStyle={startStyle}
          style={endStyle}
          onRest={onAnimationFinished} >
      {
        interpolatedStyle => {
          return (
            <div className="animated-component-container" style={interpolatedStyle}>
             { viewObject }
            </div>            
          );
        }
      }
    </Motion>
  );
};

AnimatedComponentView.propTypes = {
  viewObject: PropTypes.object,
  springiness: PropTypes.number,
  damping: PropTypes.number,
  onRest: PropTypes.func,
  startDisplay: PropTypes.shape({   // initial display properties
    startPositionRect: PropTypes.object,
    size: PropTypes.number,         // size of gamete image (default: 30)
    rotation: PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of gamete image (default: 1.0)
  }).isRequired,
  targetDisplay: PropTypes.shape({  // final display properties
    targetPositionRect: PropTypes.object,
    size: PropTypes.number,         // size of gamete image (default: 30)
    rotation: PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of gamete image (default: 1.0)
  }).isRequired,
  runAnimation: PropTypes.bool
};

export default AnimatedComponentView;
