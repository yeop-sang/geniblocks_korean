import React, { PropTypes } from 'react';
import AnimatedSprite from '../components/animated-sprite';
import OrganismView from '../components/organism';
import classNames from 'classnames';

export default class EggHatchDrakeView extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    eggClasses: PropTypes.string,
    drakeClasses: PropTypes.string,
    drake: PropTypes.object,
    hatchStarted: PropTypes.bool,
    skipHatchAnimation: PropTypes.bool,
    onHatchComplete: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      hatchStarted: props.hatchStarted || props.skipHatchAnimation,
      hatchComplete: props.skipHatchAnimation
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.hatchStarted !== nextProps.hatchStarted)
      this.setState({ hatchStarted: nextProps.hatchStarted, hatchComplete: false });
    if (nextProps.skipHatchAnimation)
    this.setState({ hatchComplete: true });
  }

  handleHatchComplete = () => {
    this.setState({ hatchComplete: true });
    if (this.props.onHatchComplete)
      this.props.onHatchComplete();
  }

  render() {
    const { id, eggClasses, drakeClasses, drake } = this.props,
          { hatchStarted, hatchComplete } = this.state,
          eggHatchAnimation = <AnimatedSprite
                                  classNames={classNames('egg-image', eggClasses)}
                                  waitForTrigger={!hatchStarted}
                                  frames={16} frameWidth={1052} duration={1333}
                                  onEnd={this.handleHatchComplete} />,
          hatchedDrake = <OrganismView org={drake} className={drakeClasses} width={300} />,
          eggOrDrakeView = hatchComplete ? hatchedDrake : eggHatchAnimation;
    return (
      <div id={id} className={'geniblocks egg-hatch-drake'}>
        {eggOrDrakeView}
      </div>
    );
  }
}
