import React, {PropTypes} from 'react';

const LocationIndicatorView = ({locationName}) => {

  return (
    <div className='geniblocks location-indicator'>
      <div className='hud-text-area'>
        <div className='location-label'>{locationName}</div>
      </div>
    </div>
  );
};

LocationIndicatorView.propTypes = {
  locationName: PropTypes.string
};

export default LocationIndicatorView;
