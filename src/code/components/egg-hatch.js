import React, {PropTypes} from 'react';
import { EggView } from './egg-clutch';
import OrganismView from './organism';
import OrganismGlowView from './organism-glow';

class EggHatchView extends React.Component {

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
  }

  render() {
    const { id, egg, organism, glow, displayStyle, onClick } = this.props,
          { size: width, hatchProgress } = displayStyle,
          newID = 'egg-hatch' + (id ? '-' + id : ''),
          opacity = (displayStyle && (displayStyle.opacity != null)) ? displayStyle.opacity : 1,
          drakeOpacity = hatchProgress * opacity,
          eggOpacity = (1.0 - hatchProgress) * opacity,
          eggStyle = { position: 'absolute', size: width, opacity: eggOpacity },
          drakeStyle = { position: 'absolute', opacity: drakeOpacity, marginLeft: -width/4 },
          glowStyle = { opacity: drakeOpacity, marginLeft: -width/4 },
          orgView = glow
                      ? <OrganismGlowView id='egg-hatch-org' org={organism} size={1.5 * width}
                                          style={drakeStyle} glowStyle={glowStyle}/>
                      : <OrganismView id='egg-hatch-org' org={organism} width={1.5 * width} 
                                          style={drakeStyle} />;
    return (
      <div id={newID} className='geniblocks egg-hatch' style={{ position: 'relative', width }}
            onClick={onClick ? this.handleClick : null} >
        <EggView egg={egg} displayStyle={eggStyle} isSelected={true} />
        {orgView}
      </div>
    );
  }
}

export default EggHatchView;
