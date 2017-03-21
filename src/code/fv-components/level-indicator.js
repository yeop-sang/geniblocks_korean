import React, {PropTypes} from 'react';
import t from '../utilities/translate';

const LevelIndicatorView = ({level}) => {

  const levelLabel = t('~LEVEL_INDICATOR.LEVEL_LABEL');
  return (
    <div className='geniblocks level-indicator'>
      <div className='level-text-area'>
        <div className='level-indicator-label hud-text'>{levelLabel}</div>
        <div className='level-indicator-text hud-text'>{level}</div>
      </div>
    </div>
  );
};

LevelIndicatorView.propTypes = {
  level: PropTypes.number
};

export default LevelIndicatorView;
