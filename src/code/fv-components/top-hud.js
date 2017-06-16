import React, {PropTypes} from 'react';
import LocationIndicatorView from './location-indicator';

const TopHUDView = ({location, onDisplayMap}) => {

  return (
    <div id='fv-top-hud' className='fv-hud fv-top-hud' >
      <div className="map-button" onClick={onDisplayMap}></div>
      <LocationIndicatorView location={location} />
    </div>
  );
};

TopHUDView.propTypes = {
  location: PropTypes.string,
  onDisplayMap: PropTypes.func
};

export default TopHUDView;
