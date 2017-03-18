import React, {PropTypes} from 'react';

const TrialCountView = ({trial, trialCount}) => {

  const trialCountLabel = 'TRIAL',
        trialCountText = `${trial} of ${trialCount}`;
  return (
    <div className='geniblocks trial-count'>
      <div className='text-area'>
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
