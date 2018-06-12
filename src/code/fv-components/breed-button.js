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

  handleClick = () => {
    if (!this.state.tempDisabled) {
      this.props.onClick();
      this.setState({tempDisabled: true});
      // Disable the button for a bit to avoid mass breeding
      this.timer = setTimeout(() => {
        this.setState({tempDisabled: false});
        this.timer = null;
      }, 500);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const disabled = this.props.disabled || this.state.tempDisabled;
    return (
      <div className={classNames('breed-button', { disabled })} onClick={this.handleClick}>
        <div className="button-label breed-button-label unselectable">{ t("~FV_EGG_GAME.BREED_BUTTON") }</div>
      </div>
    );
  }
}
