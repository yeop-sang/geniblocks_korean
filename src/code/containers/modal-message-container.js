import { connect } from 'react-redux';
import ModalAlert from '../components/modal-alert';

const messageProps = {
  MatchDrakeFailure: {
    message: "That's not the drake!",
    explanation: "The drake you have created doesn't match the target drake.\nPlease try again.",
    rightButton: {
      label: "Try again",
      clickFunc: "onDismiss"
    }
  },
  MatchDrakeSuccessLastTrial: {
    message: "Good work!",
    explanation: "The drake you have created matches the target drake.",
    rightButton: {
      label: "Next challenge",
      clickFunc: "onDismiss"
    }
  }
};

function mapStateToProps (state) {
  var props;
  if (state.trialSuccess) {
    props = messageProps.MatchDrakeSuccessLastTrial;
  } else {
    props = messageProps.MatchDrakeFailure;
  }
  return {
    show: state.showingInfoMessage,
    ...props
  };
}

const ModalMessageContainer = connect(mapStateToProps)(ModalAlert);

export default ModalMessageContainer;
