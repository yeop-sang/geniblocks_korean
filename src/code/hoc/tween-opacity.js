import React, { PropTypes } from 'react';
const tweenState = require('react-tween-state');

export default function tweenOpacity() {

  return function(WrappedComponent) {
    return React.createClass({

      mixins: [tweenState.Mixin],

      getInitialState() {
        return {"opacity": this.props.initialOpacity};
      },

      propTypes: {
        initialOpacity: PropTypes.number,
        targetOpacity: PropTypes.number,
        duration: PropTypes.number,
        onEnd: PropTypes.func,
        displayStyle: PropTypes.object
      },

      getDefaultProps() {
        return {
          initialOpacity: 1,
          targetOpacity: 0,
          duration: 2000
        };
      },

      componentWillMount() {
        this.tweenState("opacity", {
          easing: tweenState.easingTypes.linear,
          duration: this.props.duration,
          endValue: this.props.targetOpacity,
          onEnd: this.props.onEnd
        });
      },
      
      render() {
        const { displayStyle, ...otherProps } = this.props,
              opacityStyle = { "opacity": this.getTweeningValue("opacity") },
              newDisplayStyle = Object.assign({}, displayStyle, opacityStyle);
        return <WrappedComponent style={newDisplayStyle} {...otherProps} />;
      }

    });
  };
}
