import React, {PropTypes} from 'react';
import AnimatedSprite from '../components/animated-sprite';
import OrganismView from '../components/organism';
import OrganismGlowView from '../components/organism-glow';

class FVEggHatchView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      finished: false
    };
  }

  static propTypes = {
    id: PropTypes.string,
    egg: PropTypes.object,
    organism: PropTypes.object,
    glow: PropTypes.bool,
    displayStyle: PropTypes.object,
    onClick: PropTypes.func
  };

  handleClick = (evt) => {
    const { onClick } = this.props;
    if (onClick) onClick(evt);
  };

  handleEnd = () => {
    this.setState({finished: true});
  };

  render() {
    const { id, organism, glow, displayStyle, onClick } = this.props,
          { size: width } = displayStyle,
          newID = 'egg-hatch' + (id ? '-' + id : ''),
          drakeOpacity = 1,
          eggOpacity = 1,
          defaultEggStyle = { position: 'absolute', size: width, opacity: eggOpacity },
          combinedEggStyle = {...defaultEggStyle, ...displayStyle},
          defaultDrakeStyle = { position: 'absolute', opacity: drakeOpacity,
                          marginLeft: width*7.6, marginTop: width*5 },
          combinedDrakeStyle = {...defaultDrakeStyle, ...displayStyle},
          glowStyle = { opacity: drakeOpacity, marginLeft: width*7.6, marginTop: width*5 },
          orgView = glow
                      ? <OrganismGlowView id='egg-hatch-org' org={organism} size={2.5 * width}
                                          style={combinedDrakeStyle} glowStyle={glowStyle}/>
                      : <OrganismView id='egg-hatch-org' org={organism} width={2.5 * width} 
                                          style={combinedDrakeStyle} />,
          displayedView = this.state.finished ? orgView : <AnimatedSprite onEnd={this.handleEnd} classNames={"animated-egg-image"} frames={16} frameWidth={1052} duration={1333} style={combinedEggStyle} />;

    return (
      <div id={newID} className='geniblocks egg-hatch' style={{ position: "absolute", width }}
            onClick={onClick ? this.handleClick : null} >
        {displayedView}
      </div>
    );
  }
}

export default FVEggHatchView;
