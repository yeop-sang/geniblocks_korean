import React, {PropTypes} from 'react';
import TrialCountView from './trial-count';

const BottomHUDView = ({trial, trialCount}) => {

  return (
    <div id='fv-bottom-hud' className='fv-hud fv-bottom-hud' >
      <TrialCountView trial={trial} trialCount={trialCount} />
    </div>
  );
};

BottomHUDView.propTypes = {
  trial: PropTypes.number,
  trialCount: PropTypes.number
};

export default BottomHUDView;
