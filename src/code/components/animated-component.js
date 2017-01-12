import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

const AnimatedComponentView = ({animEvent, viewObject, speed, bouncy, startDisplay, targetDisplay, runAnimation, onRest}) => {

  if (!runAnimation) return null;
  if (!startDisplay || !targetDisplay) return null;

  let springiness = 100, damping = 25;
  if (bouncy) damping = 2;
  let linear = false;
  if (speed != null){
    if (speed === "slow"){
      springiness = 60;
    } else if (speed === "medium"){
      springiness = 90;
    }
    else if (speed === "fast"){
      springiness = 120;
    }
    else if (speed === "superfast"){
      springiness = 150;
    }
    else if (speed === "noWobble"){
      // matches "noWobble" preset in react-motion
      springiness = 170;
      damping = 26;
    }
  } else {
    linear = true;
  }

  const springConfig = { stiffness: springiness, damping: damping };
  //const springConfig = {...presets.noWobble, precision: 0.1};

  let startStyle = {}, endStyle = {},
      prop;
  const { startPositionRect: startRect, ...startOthers } = startDisplay,
        { targetPositionRect: endRect, ...endOthers } = targetDisplay;
  if (startRect) {
    startStyle.left = startRect.left;
    startStyle.top = startRect.top;
  }
  // handle size, opacity, etc.
  for (prop in startOthers) {
    if (startOthers[prop] != null)
      startStyle[prop] = startOthers[prop];
  }

  if (endRect) {
    if (!linear){
      endStyle.left = spring(endRect.left, springConfig);
      endStyle.top = spring(endRect.top, springConfig);
    } else {
      endStyle.left = endRect.left;
      endStyle.top = endRect.top;
    }
  }
  // handle size, opacity, etc.
  for (prop in endOthers) {
    if (endOthers[prop] != null)
      endStyle[prop] = spring(endOthers[prop], springConfig);
  }

  const animatedViewObject = function(interpolatedStyle) {
    return React.cloneElement(viewObject, {
        displayStyle: interpolatedStyle
      });
  };

  const onAnimationFinished = () => {
    onRest(animEvent);
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
             { animatedViewObject(interpolatedStyle) }
            </div>
          );
        }
      }
    </Motion>
  );
};

AnimatedComponentView.propTypes = {
  animEvent: PropTypes.number,
  viewObject: PropTypes.object,
  speed: PropTypes.string,
  bouncy: PropTypes.bool,
  onRest: PropTypes.func,
  startDisplay: PropTypes.shape({   // initial display properties
    startPositionRect: PropTypes.object,
    size: PropTypes.number,         // size of rendered component (percentage string)
    rotation: PropTypes.number,     // rotation (deg) of component (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of component (default: 1.0)
  }).isRequired,
  targetDisplay: PropTypes.shape({  // final display properties
    targetPositionRect: PropTypes.object,
    size: PropTypes.number,
    rotation: PropTypes.number,
    opacity: PropTypes.number
  }).isRequired,
  runAnimation: PropTypes.bool
};

export default AnimatedComponentView;
