import { connect } from 'react-redux';
import Notifications from '../components/notifications';

function mapStateToProps (state) {
    return {
      // TODO: For the purposes of the upcoming classroom test we simply stash the location
      // in a global. Beyond the classroom test, the ITS feedback will presumably end up in
      // the HUD or some other such location so that this mechanism can be eliminated.
      // If it weren't temporary, a better long-term solution would be to put the location
      // in the state and have it handled via normal redux mechanisms, but that effort
      // doesn't seem worth it given the temporary nature of the need.
      location: window.gNotificationLocation,
      notifications: state.notifications
    };
  }

const NotificationContainer = connect(mapStateToProps)(Notifications);

export default NotificationContainer;
