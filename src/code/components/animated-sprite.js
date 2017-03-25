import React, { PropTypes } from 'react';
const tweenState = require('react-tween-state');

const FVAnimatedSprite = React.createClass({

  mixins: [tweenState.Mixin],

  propTypes: {
    frames: PropTypes.number.isRequired,
    frameWidth: PropTypes.number.isRequired,
    duration: PropTypes.number,
    classNames: PropTypes.string,
    onEnd: PropTypes.func
  },

  defaultProps: {
    duration: 2000,
    classNames: ""
  },

  getInitialState() {
    return {"backgroundPositionX": 0};
  },

  componentWillMount() {
    this.tweenState("backgroundPositionX", {
      easing: tweenState.easingTypes.linear,
      duration: this.props.duration,
      endValue: this.props.frames,
      onEnd: this.props.onEnd
    });
  },

  render() {
    let style = {"backgroundPositionX": Math.floor(this.getTweeningValue("backgroundPositionX")) * -this.props.frameWidth + "px"};
    return (
      <div className={this.props.classNames} style={style}/>
    );
  }
});

export default FVAnimatedSprite;
