import { connect } from 'react-redux';
import Notifications from '../components/notifications';
import { advanceNotifications, closeNotifications } from '../modules/notifications';

function mapStateToProps (state) {
  return {
    notifications: state.notifications
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAdvanceNotifications: () => dispatch(advanceNotifications()),
    onCloseNotifications: () => dispatch(closeNotifications())
  };
} 

const NotificationContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications);

export default NotificationContainer;
