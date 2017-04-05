import React, { PropTypes } from 'react';
const tweenState = require('react-tween-state');

const FVAnimatedSprite = React.createClass({

  mixins: [tweenState.Mixin],

  propTypes: {
    waitForTrigger: PropTypes.bool,
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

  animate() {
    this.tweenState("backgroundPositionX", {
      easing: tweenState.easingTypes.linear,
      duration: this.props.duration,
      endValue: this.props.frames,
      onEnd: this.props.onEnd
    });
    this.setState({ started: true });
  },

  componentDidMount() {
    if (!this.props.waitForTrigger)
      this.animate();
  },

  componentWillReceiveProps(nextProps) {
    if (!this.state.started && !nextProps.waitForTrigger)
      this.animate();
  },

  render() {
    const tweenValue = this.state.started
                        ? Math.floor(this.getTweeningValue("backgroundPositionX"))
                        : 0,
          style = {"backgroundPositionX": tweenValue * -this.props.frameWidth + "px"};
    return (
      <div className={this.props.classNames} style={style}/>
    );
  }
});

export default FVAnimatedSprite;
