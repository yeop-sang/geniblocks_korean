import React, {PropTypes} from 'react';
import t from '../utilities/translate';

const TrialCountView = ({trial, trialCount}) => {

  const trialCountLabel = t('~TRIAL_COUNTER.TRIAL_LABEL'),
        trialCountText = t(['~TRIAL_COUNTER.TRIAL_n_OF_N', trial, trialCount]);
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
