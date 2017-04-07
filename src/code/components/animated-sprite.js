import React, { PropTypes } from 'react';
const tweenState = require('react-tween-state');

const AnimatedSprite = React.createClass({

  mixins: [tweenState.Mixin],

  propTypes: {
    waitForTrigger: PropTypes.bool,
    frames: PropTypes.number.isRequired,
    frameWidth: PropTypes.number.isRequired,
    duration: PropTypes.number,
    classNames: PropTypes.string,
    onEnd: PropTypes.func,
    style: PropTypes.object
  },

  getDefaultProps() {
    return ({
      duration: 2000,
      classNames: "",
      style: {}
    });
  },

  getInitialState() {
    return { backgroundPositionX : 0 };
  },

  animate() {
    this.tweenState("backgroundPositionX", {
      easing: tweenState.easingTypes.linear,
      duration: this.props.duration,
      beginValue: 0,  // always animate from beginning
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
    if (this.props.waitForTrigger && !nextProps.waitForTrigger)
      this.animate();
  },

  render() {
    const tweenValue = this.state.started
                        ? Math.floor(this.getTweeningValue("backgroundPositionX"))
                        : this.state.backgroundPositionX,
          newStyle = Object.assign({}, this.props.style, {"backgroundPositionX": tweenValue * -this.props.frameWidth + "px"});
    return (
      <div className={this.props.classNames} style={newStyle}/>
    );
  }
});

export default AnimatedSprite;
