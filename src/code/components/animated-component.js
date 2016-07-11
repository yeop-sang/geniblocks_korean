import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

const AnimatedComponentView = ({viewObject, springiness = 100, damping = 30, startDisplay, targetDisplay, runAnimation, onRest}) => {
  if (!runAnimation) return null;
  if (!startDisplay || !targetDisplay) return null;

  let sourceRects = {}, targetRects = {};
  
  let source = document.getElementById(startDisplay.startPositionId);
  if (source){
    sourceRects = source.getClientRects()[0];
  } else {
    console.log("no rects!", source, startDisplay);
    return (null);
  }

  let target = document.getElementById(targetDisplay.targetPositionId);
   if (target){
    targetRects = target.getClientRects()[0];
  } else {
    console.log("no rects!", target, targetDisplay);
    return (null);
  }
  console.log(source, target);
  let startStyle = {}, endStyle = {};
  startStyle.x = sourceRects.left;
  startStyle.y = sourceRects.top;
  startStyle.opacity = 1;

  endStyle.x = targetRects.left;
  endStyle.y = sourceRects.top; // can't yet get to the exact chromosome target
  endStyle.opacity = 0;


  const
    springConfig = { stiffness: springiness, damping: damping };

  const onAnimationFinished = () => {
    onRest();
  };

  return (
    <Motion className='geniblocks animated-component-view'
            defaultStyle={{
            x: startStyle.x, y: startStyle.y,
            opacity: startStyle.opacity
          }}
          style={{
            x: spring(endStyle.x, springConfig),
            y: spring(endStyle.y, springConfig),
            opacity: spring(endStyle.opacity, springConfig)
          }}
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
    startPositionId: PropTypes.string,
    size: PropTypes.number,         // size of gamete image (default: 30)
    rotation: PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of gamete image (default: 1.0)
  }).isRequired,
  targetDisplay: PropTypes.shape({  // final display properties
    targetPositionId: PropTypes.string,
    size: PropTypes.number,         // size of gamete image (default: 30)
    rotation: PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of gamete image (default: 1.0)
  }).isRequired,
  runAnimation: PropTypes.bool
};

export default AnimatedComponentView;
