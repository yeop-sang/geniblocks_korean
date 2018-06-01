import React, {PropTypes} from 'react';
import classNames from 'classnames';
import t from '../utilities/translate';

const CountView = ({countTitleText, className, currCount, maxCount}) => {

  const countText = maxCount !== undefined ?
    t(['~COUNTER.n_OF_N', currCount.toString(), maxCount.toString()])
    : currCount;
  return (
    <div className={classNames('geniblocks', 'counter', className)}>
      <div className='hud-text-area'>
        <div className='count-label'>{countTitleText}</div>
        <div className='count-text'>{countText}</div>
      </div>
    </div>
  );
};

CountView.propTypes = {
  countTitleText: PropTypes.string.isRequired,
  // should be required but allow null, but PropTypes doesn't support it
  // cf. https://github.com/facebook/react/issues/3163
  currCount: PropTypes.number,
  maxCount: PropTypes.number,
  className: PropTypes.string
};

export default CountView;
