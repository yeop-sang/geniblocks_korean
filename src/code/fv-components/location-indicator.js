import React, {PropTypes} from 'react';

const LocationIndicatorView = ({location}) => {

  return (
    <div className='geniblocks location-indicator'>
      <div className='hud-text-area'>
        <div className='location-label'>{location}</div>
      </div>
    </div>
  );
};

LocationIndicatorView.propTypes = {
  location: PropTypes.string
};

export default LocationIndicatorView;
