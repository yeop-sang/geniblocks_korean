import React, {PropTypes} from 'react';
import Dimensions from 'react-dimensions';

/*
  Higher-order component (HOC) that uses the PropsProxy pattern
  (https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  to determine the scale factor required to fit the WrappedComponent into its container.

  To use this HOC, caller may provide a `dimensionsOptions` object (which is passed to the
  Dimensions HOC (https://github.com/digidem/react-dimensions) and a `contentFn`, which should
  return the size of the content to be accommodated. To the resulting component, the caller
  must also provide a `content` property which is an object with the following members:
  - width {number} the width of the content
  - height {number} the height of the content
  - minWidth {number} [optional] the minimum width of the content; if present,
              the width below which scaling will stop and scrolling will be enabled
  - minHeight {number} [optional] the minimum height of the content; if present,
              the height below which scaling will stop and scrolling will be enabled

  This HOC will then provide the following properties to the WrappedComponent:
  - scale {number} the numeric scale factor to apply, e.g. `0.75` for 75%
  - style {object} an object of the form { transform: `scale(${scale})` }
          which can be applied to a React component/DOM element to enable the transform.
 */

export default function scaleToFit(dimensionsOptions, contentFn) {

  function calcScaleFactor(container, props) {
    const content = contentFn(props);
    // if there's enough room, then no scaling required (we don't scale up)
    if ((container.width >= content.width) &&
        (container.height >= content.height)) {
      return 1.0;
    }
    // if scaling is required, figure out the controlling dimension
    // contentLimit is the container size limited by minimum content constraints
    const contentLimitWidth = Math.max(container.width, content.minWidth || content.width),
          contentLimitHeight = Math.max(container.height, content.minHeight || content.height),
          contentLimitAspect = contentLimitWidth / contentLimitHeight,
          contentAspect = content.width / content.height;

    // width is the constraining dimension
    return contentLimitAspect <= contentAspect
              ? contentLimitWidth / content.width    // width is constraining dimension
              : contentLimitHeight / content.height; // height is constraining dimension
  }

  function scaledComponent(WrappedComponent) {
    return class extends React.Component {

      static propTypes = {
        containerWidth: PropTypes.number.isRequired,
        containerHeight: PropTypes.number.isRequired,
        content: PropTypes.shape({
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
          minWidth: PropTypes.number,
          minHeight: PropTypes.number
        })
      }

      render() {
        const { containerWidth, containerHeight, ...otherProps } = this.props,
              container = { width: containerWidth, height: containerHeight },
              scale = calcScaleFactor(container, this.props),
              style = { transform: `scale(${scale})`};
        return (
          <WrappedComponent scale={scale} style={style} {...otherProps} />
        );
      }
    };
  }

  return function(WrappedComponent) {
    return Dimensions(dimensionsOptions)(scaledComponent(WrappedComponent));
  };
}
