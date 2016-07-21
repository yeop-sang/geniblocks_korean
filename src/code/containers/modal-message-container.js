import { connect } from 'react-redux';
import ModalAlert from '../components/modal-alert';
import * as actions from '../actions';

function mapStateToProps (state) {
  let props = state.modalDialog;
  if (props.showAward) {
    props = props.merge({
      challengeAwards: {
        caseId: state.case,
        challengeId: state.challenge,
        challengeCount: state.challenges,
        progress: state.challengeProgress
      }
    });
  }
  return {
    ...props
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actionCreator: function (actionName) {
      return () =>
        dispatch(actions[actionName]());
    }
  };
}

function mergeProps(stateProps, dispatchProps) {
  let props = {...stateProps};
  if (stateProps.leftButton && props.leftButton.action) {
    props.onLeftButtonClick = dispatchProps.actionCreator(props.leftButton.action);
  }
  if (props.rightButton && props.rightButton.action) {
    props.onRightButtonClick = dispatchProps.actionCreator(props.rightButton.action);
  }
  return props;
}

const ModalMessageContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalAlert);

export default ModalMessageContainer;
