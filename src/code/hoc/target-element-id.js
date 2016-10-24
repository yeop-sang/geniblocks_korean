import React, {PropTypes} from 'react';

/*
  Higher-order component (HOC) that uses the PropsProxy pattern
  (https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  to adjust the targetStyle prop of the WrappedComponent to target a DOM element.

  To use this HOC, caller must provide a `target` prop to the WrappedComponent
  which contains the following members:
  - id: the DOM id of the element to be targeted
  - leftOffset: the horizontal offset from the top-left of the target element
  - topOffset: the vertical offset from the top-left of the target element

  This HOC will then replace the 'left' and 'top' properties of the 'targetStyle'
  prop with those computed by determining the current location of the specified
  DOM element and adding the provided offsets.

  If the specified DOM element is not found, nothing is rendered on the grounds that
  rendering nothing is less distracting than rendering something in the wrong place.
  This could occur, for instance, on the first time through the render loop if the
  animated element were rendered before the element to be followed.
 */
export default function targetElementId() {

  function getTargetLocation(props) {
    const { target } = props,
          elt = target && document.getElementById(target.id),
          eltBounds = elt && elt.getBoundingClientRect();
    if (!eltBounds) return null;
    return {
      left: eltBounds.left + (target.leftOffset != null ? target.leftOffset : 0),
      top: eltBounds.top + (target.topOffset != null ? target.topOffset : 0)
    };
  }

  return function(WrappedComponent) {
    return class extends React.Component {

      static propTypes = {
        target: PropTypes.shape({
                  id: PropTypes.string.isRequired,
                  leftOffset: PropTypes.number,
                  topOffset: PropTypes.number
                }),
        targetStyle: PropTypes.object
      }
      
      render() {
        const { target, targetStyle, ...otherProps } = this.props,
              targetLocation = getTargetLocation(this.props),
              newTarget = Object.assign({}, targetStyle, targetLocation);
        return (
          !target || (targetLocation != null)
            ? <WrappedComponent targetStyle={newTarget} {...otherProps} />
            : null
        );
      }
    };
  };
}
