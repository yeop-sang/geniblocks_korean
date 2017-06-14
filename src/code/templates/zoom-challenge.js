import React, { Component, PropTypes } from 'react';

export default class ZoomChallenge extends Component {

  static backgroundClasses = 'fv-layout fv-layout-zoom'

  render() {
    return (
      <div id="zoom-challenge-container">
        <iframe id="iframe" src="" />
      </div>
    );
  }

  static authoredDrakesToDrakeArray = function() {
    return [];
  }

}
