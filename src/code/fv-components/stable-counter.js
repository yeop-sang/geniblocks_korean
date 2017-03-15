import React, {PropTypes} from 'react';

const FVStableCounter = ({count, maxCount=5}) => {
  return (
    <div className="stable-counter">
      <div className="stable-text">Stable Count:</div>
      <div className="stable-count">{count + " / " + maxCount}</div>
    </div>
  );
};

FVStableCounter.propTypes = {
  count: PropTypes.number,
  maxCount: PropTypes.number
};

export default FVStableCounter;
