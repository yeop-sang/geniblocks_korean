import React, {PropTypes} from 'react';

const TrialCountView = ({trial, trialCount}) => {

  const trialCountLabel = 'TRIAL',
        trialCountText = `${trial}\xA0\xA0of\xA0\xA0${trialCount}`;
  return (
    <div className='geniblocks trial-count'>
      <div className='hud-text-area'>
        <div className='trial-count-label'>{trialCountLabel}</div>
        <div className='trial-count-text'>{trialCountText}</div>
      </div>
    </div>
  );
};

TrialCountView.propTypes = {
  trial: PropTypes.number,
  trialCount: PropTypes.number
};

export default TrialCountView;
