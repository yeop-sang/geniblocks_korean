import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigateToCurrentRoute, navigateToChallenge } from '../actions';
import ChallengeContainer from './challenge-container';
import FVChallengeContainer from './fv-challenge-container';
import AuthoringUtils from '../utilities/authoring-utils';
import urlParams from '../utilities/url-params';

function hasChangedRouteParams(currentRouteSpec, routeParams) {
  const { level: currLevel, mission: currMission, challenge: currChallenge } = currentRouteSpec,
        currLevelStr = String(currLevel + 1),
        currMissionStr = String(currMission + 1),
        currChallengeStr = String(currChallenge + 1);
  return (routeParams.mission && routeParams.challenge && routeParams.level &&
        ((routeParams.mission !== currMissionStr) || (routeParams.challenge !== currChallengeStr) || (routeParams.level !== currLevelStr)));
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
    currentRouteSpec: PropTypes.shape({
      level: PropTypes.number,
      mission: PropTypes.number,
      challenge: PropTypes.number
    }).isRequired,
    // Potentially updated, incoming route parameters
    routeParams: PropTypes.shape({
      level: PropTypes.string,
      mission: PropTypes.string,
      challenge: PropTypes.string
    }),
    navigateToChallenge: PropTypes.func,
    navigateToCurrentRoute: PropTypes.func
  }

  componentWillMount() {
    const { navigateToCurrentRoute, navigateToChallenge, authoring } = this.props;
    // the URL's challengeId is only used for initial routing, so prioritize the numeric route params
    let routeParams = this.props.routeParams;
    if (!routeParams.challenge && urlParams.challengeId) {
      routeParams = AuthoringUtils.challengeIdToRouteParams(authoring, urlParams.challengeId);
    }
    if (hasChangedRouteParams(this.props.currentRouteSpec, routeParams)) {
      navigateToCurrentRoute({level: routeParams.level-1, mission: routeParams.mission-1, challenge: routeParams.challenge-1});
    } else {
      navigateToChallenge({level: 0, mission: 0, challenge: 0});
    }
  }

  componentWillReceiveProps(newProps) {
    const { navigateToCurrentRoute, authoring } = newProps;
    let routeParams = this.props.routeParams;
    if (!routeParams.challenge && urlParams.challengeId) {
      routeParams = AuthoringUtils.challengeIdToRouteParams(authoring, urlParams.challengeId);
    }
    if (hasChangedRouteParams(newProps.currentRouteSpec, routeParams)) {
      navigateToCurrentRoute({level: routeParams.level-1, mission: routeParams.mission-1, challenge: routeParams.challenge-1});
    }
  }

  render() {
    const { authoring, currentRouteSpec, ...otherProps } = this.props,
          authoredChallenge = AuthoringUtils.getChallengeDefinition(authoring, currentRouteSpec),
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
    currentRouteSpec: state.routeSpec
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToChallenge: (routeSpec) => dispatch(navigateToChallenge(routeSpec)),
    navigateToCurrentRoute: (routeSpec) => dispatch(navigateToCurrentRoute(routeSpec))
  };
}

const ConnectedChallengeContainerSelector = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainerSelector);
export default ConnectedChallengeContainerSelector;
