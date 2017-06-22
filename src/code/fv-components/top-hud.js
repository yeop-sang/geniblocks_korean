import React, {PropTypes} from 'react';
import LocationIndicatorView from './location-indicator';

const TopHUDView = ({locationName, onToggleMap}) => {
  let onDisplayMap = () => {
    onToggleMap(true);
  };

  return (
    <div id='fv-top-hud' className='fv-hud fv-top-hud' >
      <div className="map-button" onClick={onDisplayMap}></div>
      <LocationIndicatorView locationName={locationName} />
    </div>
  );
};

TopHUDView.propTypes = {
  locationName: PropTypes.string,
  onToggleMap: PropTypes.func
};

export default TopHUDView;
