import { connect } from 'react-redux';
import ModalAlert from '../components/modal-alert';
import * as actions from '../actions';
import { resetGametes } from '../modules/gametes';
Object.assign(actions, { resetGametes });

function mapStateToProps (state) {
  let props = state.modalDialog;
  if (props.showAward) {
    props = props.merge({
      challengeAwards: {
        routeSpec: state.routeSpec,
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
    actionCreator: function (actionName, actionArgs) {
      return () =>
        dispatch(actions[actionName](actionArgs));
    }
  };
}

function mergeProps(stateProps, dispatchProps) {
  let props = {...stateProps},
      { leftButton, rightButton } = props;
  if (leftButton && leftButton.action) {
    props.onLeftButtonClick = dispatchProps.actionCreator(leftButton.action, leftButton.args);
  }
  if (rightButton && rightButton.action) {
    props.onRightButtonClick = dispatchProps.actionCreator(rightButton.action, rightButton.args);
  }
  return props;
}

const ModalMessageContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalAlert);

export default ModalMessageContainer;
