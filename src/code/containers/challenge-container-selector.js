import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigateToCurrentRoute, navigateToChallenge } from '../actions';
import ChallengeContainer from './challenge-container';
import FVChallengeContainer from './fv-challenge-container';

function hasChangedRouteParams(props) {
  const { currentRouteSpec, routeParams } = props,
        { level: currLevel, mission: currMission, challenge: currChallenge } = currentRouteSpec,
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
    authoring: PropTypes.array.isRequired,
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
    const { routeParams, navigateToCurrentRoute, navigateToChallenge } = this.props;
    if (hasChangedRouteParams(this.props)) {
      navigateToCurrentRoute({level: routeParams.level-1, mission: routeParams.mission-1, challenge: routeParams.challenge-1});
    } else {
      navigateToChallenge({level: 0, mission: 0, challenge: 0});
    }
  }

  componentWillReceiveProps(newProps) {
    const { routeParams, navigateToCurrentRoute } = newProps;
    if (hasChangedRouteParams(newProps)) {
      navigateToCurrentRoute({level: routeParams.level-1, mission: routeParams.mission-1, challenge: routeParams.challenge-1});
    }
  }

  render() {
    const { authoring, currentRouteSpec, ...otherProps } = this.props,
          { level: currLevel, mission: currMission, challenge: currChallenge } = currentRouteSpec,
          missionsInLevel = authoring[currLevel],
          challengesInMission = missionsInLevel[currMission],
          authoredChallenge = challengesInMission[currChallenge],
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
