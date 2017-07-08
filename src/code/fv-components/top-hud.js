import React, {PropTypes} from 'react';
import LocationIndicatorView from './location-indicator';
import pulse from '../hoc/pulse';

const VenturePadButtonView = ({onToggleMap}) => {
  let onDisplayMap = () => {
    onToggleMap(true);
  };

  return (
    <div className="map-button" onClick={onDisplayMap}></div>
  );
};

VenturePadButtonView.propTypes = {
  onToggleMap: PropTypes.func.isRequired,
  className: PropTypes.string
};

let PulsingButtonView = pulse()(VenturePadButtonView);

const TopHUDView = ({location, onToggleMap, isDialogComplete}) => {
  let pulse = location.id === "home" && isDialogComplete;
  return (
    <div id='fv-top-hud' className='fv-hud fv-top-hud' >
      <PulsingButtonView className="map-button-container" pulse={pulse} onToggleMap={onToggleMap} />
      <LocationIndicatorView locationName={location.name} />
    </div>
  );
};

TopHUDView.propTypes = {
  location: PropTypes.object,
  onToggleMap: PropTypes.func,
  isDialogComplete: PropTypes.bool
};

export default TopHUDView;
