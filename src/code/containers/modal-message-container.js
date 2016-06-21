import { connect } from 'react-redux';
import ModalAlert from '../components/modal-alert';
import { dismissModalDialog, advanceTrial, advanceChallenge } from '../actions';

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
      label: "Next trial",
      clickFunc: "onAdvanceTrial"
    }
  },
  ChallengeCompleted: {
    message: "Good work!",
    explanation: "You have completed all trials in this challenge.",
    rightButton: {
      label: "Next challenge",
      clickFunc: "onAdvanceChallenge"
    }
  }
};

function mapStateToProps (state) {
  var props;
  if (state.itsMessage){
    props = {
      message: "Message from ITS",
      explanation: state.itsMessage.text,
      rightButton: {
        label: "OK, thanks!",
        clickFunc: "onDismiss"
      }
    };
  } else {
    if (state.challengeComplete){
      props = messageProps.ChallengeCompleted;
    } else {
      if (state.trialSuccess) {
        props = messageProps.MatchDrakeSuccessLastTrial;
      } else {
        props = messageProps.MatchDrakeFailure;
      }
    }
  }
  return {
    show: state.showingInfoMessage,
    ...props
  };
}

function mapDispatchToProps (dispatch) {
  return {
    onDismiss: () => dispatch(dismissModalDialog()),
    onAdvanceTrial: () => dispatch(advanceTrial()),
    onAdvanceChallenge: () => dispatch(advanceChallenge())
  };
}

function mergeProps(stateProps, dispatchProps) {
  let props = {...stateProps};
  if (stateProps.leftButton) {
    props.onLeftButtonClick = dispatchProps[props.leftButton.clickFunc];
  }
  if (props.rightButton) {
    props.onRightButtonClick = dispatchProps[props.rightButton.clickFunc];
  }
  return props;
}

const ModalMessageContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalAlert);

export default ModalMessageContainer;
