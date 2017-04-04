import React, {PropTypes} from 'react';
import AvatarButtonView from './avatar-button';
import LevelIndicatorView from './level-indicator';
import CountView from './counter';
import t from '../utilities/translate';

const BottomHUDView = ({level, trial, trialCount, currScore, maxScore}) => {
  let scoreView = maxScore ? <CountView countTitleText={t('~COUNTER.SCORE_LABEL')} className={'score-count'} currCount={currScore} maxCount={maxScore} /> : null;

  return (
    <div id='fv-bottom-hud' className='fv-hud fv-bottom-hud' >
      <AvatarButtonView />
      <LevelIndicatorView level={level} />
      <CountView countTitleText={t('~COUNTER.TRIAL_LABEL')} className={'trial-count'} currCount={trial} maxCount={trialCount} />
      {scoreView}
    </div>
  );
};

BottomHUDView.propTypes = {
  level: PropTypes.number,
  trial: PropTypes.number,
  trialCount: PropTypes.number,
  currScore: PropTypes.number,
  maxScore: PropTypes.number
};

export default BottomHUDView;
