import React, {PropTypes} from 'react';
import unscaleProperties from '../utilities/unscale-properties';

/*
  Higher-order component (HOC) that uses the PropsProxy pattern
  (https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  to adjust the initialStyle prop of the WrappedComponent to target a DOM element.

  To use this HOC, caller must provide a `initial` prop to the WrappedComponent
  which contains the following members:
  - id: the DOM id of the element to be targeted
  - leftOffset: the horizontal offset from the top-left of the target element
  - topOffset: the vertical offset from the top-left of the target element

  This HOC will then replace the 'left' and 'top' properties of the 'initialStyle'
  prop with those computed by determining the current location of the specified
  DOM element and adding the provided offsets.

  If the specified DOM element is not found, nothing is rendered on the grounds that
  rendering nothing is less distracting than rendering something in the wrong place.
  This could occur, for instance, on the first time through the render loop if the
  animated element were rendered before the element to be followed.
 */
export default function initialElementId() {

  function getInitialLocation(props) {
    const { initial, scale } = props,
          elt = initial && document.getElementById(initial.id),
          eltBounds = elt && elt.getBoundingClientRect();
    if (!eltBounds) return null;
    return unscaleProperties({
      left: eltBounds.left + (initial.leftOffset != null ? initial.leftOffset : 0),
      top: eltBounds.top + (initial.topOffset != null ? initial.topOffset : 0)
    }, scale);
  }

  return function(WrappedComponent) {
    return class extends React.Component {

      static propTypes = {
        initial: PropTypes.shape({
                  id: PropTypes.string.isRequired,
                  leftOffset: PropTypes.number,
                  topOffset: PropTypes.number
                }),
        initialStyle: PropTypes.object
      }
      
      render() {
        const { initial, initialStyle, ...otherProps } = this.props,
              initialLocation = getInitialLocation(this.props),
              newInitial = Object.assign({}, initialStyle, initialLocation);
        return (
          !initial || (initialLocation != null)
            ? <WrappedComponent initialStyle={newInitial} {...otherProps} />
            : null
        );
      }
    };
  };
}
