import React, {PropTypes} from 'react';
import LocationIndicatorView from './location-indicator';

const TopHUDView = ({location}) => {

  return (
    <div id='fv-top-hud' className='fv-hud fv-top-hud' >
      <LocationIndicatorView location={location} />
    </div>
  );
};

TopHUDView.propTypes = {
  location: PropTypes.string
};

export default TopHUDView;
