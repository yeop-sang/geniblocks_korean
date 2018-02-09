import { connect } from 'react-redux';
import Notifications from '../components/notifications';
import * as actions from '../actions';
import { advanceNotifications, closeNotifications } from '../modules/notifications';

function mapStateToProps (state) {
  return {
    messages: state.notifications.messages,
    closeButton: state.notifications.closeButton,
    isRaised: state.notifications.isRaised,
    defaultCharacter: state.location.defaultCharacter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAdvanceNotifications: () => dispatch(advanceNotifications()),
    onCloseNotifications: () => dispatch(closeNotifications()),
    actionCreator: function (actionName, actionArgs) {
      return () =>
        dispatch(actions[actionName](actionArgs));
    }
  };
}

function mergeProps(stateProps, dispatchProps) {
  let props = Object.assign({}, {...stateProps}, {...dispatchProps}),
      { closeButton } = props;
  if (closeButton && closeButton.action) {
    props.onCloseButton = dispatchProps.actionCreator(closeButton.action, closeButton.args);
  }
  return props;
}

const NotificationContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Notifications);

export default NotificationContainer;
