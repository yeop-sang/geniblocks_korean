import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigateToCurrentRoute, navigateToChallenge } from '../actions';
import ChallengeContainer from './challenge-container';
import FVChallengeContainer from './fv-challenge-container';

function hasChangedRouteParams(props) {
  const { case: currCase, challenge: currChallenge, routeParams } = props,
        currCaseStr = String(currCase + 1),
        currChallengeStr = String(currChallenge + 1);
  return (routeParams.case && routeParams.challenge &&
        ((routeParams.case !== currCaseStr) || (routeParams.challenge !== currChallengeStr)));
}

function mapContainerNameToContainer(containerName) {
  switch (containerName) {
    case 'FVContainer':
      return FVChallengeContainer;
    default:
      return ChallengeContainer;
  }
}

class ChallengeContainerSelector extends Component {

  static propTypes = {
    authoring: PropTypes.object.isRequired,
    case: PropTypes.number.isRequired,
    challenge: PropTypes.number.isRequired,
    routeParams: PropTypes.shape({
      case: PropTypes.string,
      challenge: PropTypes.string
    }),
    navigateToChallenge: PropTypes.func,
    navigateToCurrentRoute: PropTypes.func
  }

  componentWillMount() {
    const { routeParams, navigateToCurrentRoute, navigateToChallenge } = this.props;
    if (hasChangedRouteParams(this.props)) {
      navigateToCurrentRoute(routeParams.case-1, routeParams.challenge-1);
    } else {
      navigateToChallenge(0, 0);
    }
  }

  componentWillReceiveProps(newProps) {
    const { routeParams, navigateToCurrentRoute } = newProps;
    if (hasChangedRouteParams(newProps)) {
      navigateToCurrentRoute(routeParams.case-1, routeParams.challenge-1);
    }
  }

  render() {
    const { authoring, case: currCase, challenge: currChallenge, ...otherProps } = this.props,
          challengesInCase = authoring[currCase],
          authoredChallenge = challengesInCase[currChallenge],
          containerName = authoredChallenge.container,
          ContainerClass = mapContainerNameToContainer(containerName);
    return (
      <ContainerClass {...otherProps} />
    );
  }
}

function mapStateToProps (state) {
  return {
    authoring: state.authoring,
    case: state.case,
    challenge: state.challenge
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToChallenge: (_case, challenge) => dispatch(navigateToChallenge(_case, challenge)),
    navigateToCurrentRoute: (_case, challenge) => dispatch(navigateToCurrentRoute(_case, challenge))
  };
}

const ConnectedChallengeContainerSelector = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainerSelector);
export default ConnectedChallengeContainerSelector;
