import React, {PropTypes} from 'react';
import classNames from 'classnames';
import t from '../utilities/translate';

const CountView = ({countTitleText, className, currCount, maxCount}) => {

  const countText = t(['~COUNTER.n_OF_N', currCount.toString(), maxCount.toString()]);
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
  currCount: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default CountView;
