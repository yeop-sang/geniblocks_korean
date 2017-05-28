/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import React, { PropTypes } from 'react';
import t from '../utilities/translate';

class Notifications extends React.Component {

  static propTypes = {
    location: PropTypes.object,
    messages: PropTypes.array,
    onCloseButton: PropTypes.func,
    onAdvanceNotifications: PropTypes.func.isRequired,
    onCloseNotifications: PropTypes.func.isRequired
  }

  static defaultProps = {
    messages: []
  }

  handleClose(onCloseButton, onCloseNotifications) {
    return () => {
      if (onCloseButton) {
        onCloseButton();
      }
      onCloseNotifications();
    };
  }

  render() {
    const speaker = this.props.messages.length > 0 ? <div className="fv-character"></div> : null,
          message = this.props.messages.length > 0 
                    ? <div className="notification">
                        <div className="close-button" onClick={ this.handleClose(this.props.onCloseButton, this.props.onCloseNotifications) }></div>
                        { this.props.messages.length > 1
                          ? <div className="next-arrow" onClick={ this.props.onAdvanceNotifications }></div> 
                          : null }
                        <div className="message-text"> { t(this.props.messages[0]) } </div>
                      </div>
                    : null;

    return (
      <div className="geniblocks notification-container">
        { speaker }
        { message }
      </div> 
    );
  }
}

export default Notifications;
