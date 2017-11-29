import React, {PropTypes} from 'react';
import classNames from 'classnames';

const ButtonView = ({text, styleName, onClick, disabled=false}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div className={classNames(styleName, 'geniblocks', 'fv-button', { 'disabled': disabled})} onClick={handleClick}>
      <div className="button-label unselectable">{text}</div>
    </div>
  );
};

ButtonView.propTypes = {
  text: PropTypes.text,
  styleName: PropTypes.text,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ButtonView;
