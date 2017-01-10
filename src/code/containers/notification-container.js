import { connect } from 'react-redux';
import Notifications from '../components/notifications';

function mapStateToProps (state) {
    return {
      notifications: state.notifications
    };
  }

const NotificationContainer = connect(mapStateToProps)(Notifications);

export default NotificationContainer;
