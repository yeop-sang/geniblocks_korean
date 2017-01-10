/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import React, { PropTypes } from 'react';
import t from '../utilities/translate';

class Notifications extends React.Component {

  static propTypes = {
    notifications: PropTypes.array
  }

  static defaultProps = {
    notifications: []
  }

  render() {
    const messages = this.props.notifications.map((message, i) =>
        <div key={i} className="notification">{ t(message) }</div>
      );

    return (
      <div className="geniblocks notification-container">
        { messages }
      </div>
    );
  }
}

export default Notifications;

