import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { navigateToCurrentRoute } from '../actions';
import ChallengeContainer from './challenge-container';
import FVChallengeContainer from './fv-challenge-container';
import AuthoringUtils from '../utilities/authoring-utils';

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
      challenge: PropTypes.string,
      challengeId: PropTypes.string
    }),
    navigateToCurrentRoute: PropTypes.func
  }

  componentWillMount() {
    const { navigateToCurrentRoute, authoring } = this.props;
    // the URL's challengeId is only used for initial routing, so prioritize the numeric route params
    let routeParams = this.props.routeParams;
    if (routeParams.challengeId) {
      routeParams = AuthoringUtils.challengeIdToRouteParams(authoring, routeParams.challengeId);
    }
    navigateToCurrentRoute({level: routeParams.level-1, mission: routeParams.mission-1, challenge: routeParams.challenge-1});
  }

  componentWillReceiveProps(newProps) {
    const { currentRouteSpec, navigateToCurrentRoute, authoring } = newProps;
    let { routeParams } = newProps;
    if (routeParams.challengeId) {
      routeParams = AuthoringUtils.challengeIdToRouteParams(authoring, routeParams.challengeId);
    }
    if (hasChangedRouteParams(currentRouteSpec, routeParams)) {
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
    navigateToCurrentRoute: (routeSpec) => dispatch(navigateToCurrentRoute(routeSpec))
  };
}

const DragDropChallengeContainerSelector = DragDropContext(HTML5Backend)(ChallengeContainerSelector),
      ConnectedChallengeContainerSelector = connect(mapStateToProps, mapDispatchToProps)(DragDropChallengeContainerSelector);
export default ConnectedChallengeContainerSelector;
