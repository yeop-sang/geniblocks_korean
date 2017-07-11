import React, {PropTypes} from 'react';
import classNames from 'classnames';
import t from '../utilities/translate';

export default class BreedButtonView extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      tempDisabled: false
    };
  }

  render() {
    let _this = this;
    const handleClick = () => {
      if (!_this.state.tempDisabled) {
        _this.props.onClick();
        _this.setState({tempDisabled: true});
        // Disable the button for a bit to avoid mass breeding
        setTimeout(function() {
          _this.setState({tempDisabled: false});
        }, 500);
      }
    };

    return (
      <div className={classNames('breed-button', { 'disabled': this.props.disabled})} onClick={handleClick}>
        <div className="button-label breed-button-label unselectable">{ t("~FV_EGG_GAME.BREED_BUTTON") }</div>
      </div>
    );
  }
}
