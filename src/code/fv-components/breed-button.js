import React, {PropTypes} from 'react';
import classNames from 'classnames';
import t from '../utilities/translate';

const BreedButtonView = ({onClick, disabled}) => {

  function handleClick() {
    onClick();
  }

  return (
    <div className={classNames('breed-button', { 'disabled': disabled})} onClick={handleClick}>
      <div className="button-label breed-button-label unselectable">{ t("~FV_EGG_GAME.BREED_BUTTON") }</div>
    </div>
  );
};

BreedButtonView.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default BreedButtonView;
