import React, {PropTypes} from 'react';
import LocationIndicatorView from './location-indicator';

const TopHUDView = ({location, onToggleMap}) => {
  let onDisplayMap = () => {
    onToggleMap(true);
  };

  return (
    <div id='fv-top-hud' className='fv-hud fv-top-hud' >
      <div className="map-button" onClick={onDisplayMap}></div>
      <LocationIndicatorView location={location} />
    </div>
  );
};

TopHUDView.propTypes = {
  location: PropTypes.string,
  onToggleMap: PropTypes.func
};

export default TopHUDView;
