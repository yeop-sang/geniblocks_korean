/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import React, { PropTypes } from 'react';
import t from '../utilities/translate';

class Notifications extends React.Component {

  static propTypes = {
    location: PropTypes.object,
    notifications: PropTypes.array,
    onAdvanceNotifications: PropTypes.func.isRequired,
    onCloseNotifications: PropTypes.func.isRequired
  }

  static defaultProps = {
    notifications: []
  }

  render() {
    const speaker = this.props.notifications.length > 0 ? <div className="fv-character"></div> : null,
          message = this.props.notifications.length > 0 
                    ? <div className="notification">
                        <div className="close-button" onClick={ this.props.onCloseNotifications }></div>
                        { this.props.notifications.length > 1
                          ? <div className="next-arrow" onClick={ this.props.onAdvanceNotifications }></div> 
                          : null }
                        <div className="message-text"> { t(this.props.notifications[0]) } </div>
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
