import React, {PropTypes} from 'react';
import classNames from 'classnames';
import t from '../utilities/translate';

const BreedButtonView = React.createClass({
  propTypes: {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  },

  handleClick: function() {
    this.props.onClick();
  },

  render: function() {
    return (
      <div className='geniblocks breed-button'>
        <div className={classNames('clickable-button', { 'disabled': this.props.disabled})} onClick={this.handleClick}>
          <div className="text unselectable">{ t("~FV_EGG_GAME.BREED_BUTTON").toUpperCase() }</div>
        </div>
      </div>
    );
  }
});

BreedButtonView.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default BreedButtonView;
