import React, {PropTypes} from 'react';
import TrialCountView from './trial-count';

const BottomHUDView = ({id, className, trial, trialCount}) => {

  return (
    <div id={id} className={className} >
      <TrialCountView trial={trial} trialCount={trialCount} />
    </div>
  );
};

BottomHUDView.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  trial: PropTypes.number,
  trialCount: PropTypes.number
};

export default BottomHUDView;
