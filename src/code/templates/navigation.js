import React, { Component, PropTypes } from 'react';

const NavigateButton = ({routeSpec, label, onClick}) => {

  function handleClick() {
    onClick(routeSpec);
  }

  return (
    <div className="navigate-button" onClick={handleClick}>
      <div className="button-label navigate-button-label unselectable">
        {label}
      </div>
    </div>
  );
};

NavigateButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  routeSpec: PropTypes.object.isRequired
};

export default class Navigation extends Component {

  static backgroundClasses = 'navigation-layout'

  render() {
    const { navigateToChallenge } = this.props;

    const handleNavigateButton = function(routeSpec) {
      navigateToChallenge(routeSpec);
    };

    const navigateButton = function(level, mission, challenge) {
      const label = "Level " + level + ", Mission " + mission + "." + challenge;
      return <NavigateButton label={label} 
                             routeSpec={{level: level - 1, mission: mission - 1, challenge: challenge - 1}} 
                             onClick={handleNavigateButton} />;
    };

    return (
      <div id="navigation">
        {navigateButton(1, 1, 1)}
        {navigateButton(2, 1, 1)}
        {navigateButton(2, 1, 2)}
        {navigateButton(2, 2, 1)}
        {navigateButton(2, 2, 2)}
        {navigateButton(2, 3, 3)}
        {navigateButton(2, 3, 4)}
        {navigateButton(2, 3, 5)}
        {navigateButton(6, 1, 1)}
        {navigateButton(6, 1, 2)}
      </div>
    );
  }

  static propTypes = {
    navigateToChallenge: PropTypes.func.isRequired
  }

  static authoredDrakesToDrakeArray = function() {
    return [];
  }

}
