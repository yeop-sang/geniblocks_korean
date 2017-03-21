import React, {PropTypes} from 'react';
import LevelIndicatorView from './level-indicator';
import TrialCountView from './trial-count';

const BottomHUDView = ({level, trial, trialCount}) => {

  return (
    <div id='fv-bottom-hud' className='fv-hud fv-bottom-hud' >
      <LevelIndicatorView level={level} />
      <TrialCountView trial={trial} trialCount={trialCount} />
    </div>
  );
};

BottomHUDView.propTypes = {
  level: PropTypes.number,
  trial: PropTypes.number,
  trialCount: PropTypes.number
};

export default BottomHUDView;
