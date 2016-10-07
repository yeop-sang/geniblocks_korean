import React, {PropTypes} from 'react';
import { EggView, EGG_IMAGE_WIDTH } from './egg-clutch';
import OrganismView from './organism';
import OrganismGlowView from './organism-glow';

class EggHatchView extends React.Component {

  static propTypes = {
    egg: PropTypes.object,
    organism: PropTypes.object,
    glow: PropTypes.bool,
    displayStyle: PropTypes.object
  };

  render() {
    const { egg, organism, glow, displayStyle } = this.props,
          width = (displayStyle && displayStyle.size) || EGG_IMAGE_WIDTH,
          hatchProgress = (displayStyle && displayStyle.hatchProgress) || 0,
          opacity = (displayStyle && (displayStyle.opacity != null)) ? displayStyle.opacity : 1,
          drakeOpacity = hatchProgress * opacity,
          eggOpacity = (1.0 - hatchProgress) * opacity,
          eggStyle = { position: 'absolute', size: width, opacity: eggOpacity },
          drakeStyle = { position: 'absolute', opacity: drakeOpacity, marginLeft: -width/4 },
          glowStyle = { opacity: drakeOpacity, marginLeft: -width/4 },
          orgView = glow
                      ? <OrganismGlowView org={organism} size={1.5 * width}
                                          style={drakeStyle} glowStyle={glowStyle}/>
                      : <OrganismView org={organism} width={1.5 * width} style={drakeStyle} />;
    return (
      <div className='geniblocks egg-hatch' style={{ position: 'relative', width }} >
        <EggView egg={egg} displayStyle={eggStyle} isSelected={true} />
        {orgView}
      </div>
    );
  }
}

export default EggHatchView;
