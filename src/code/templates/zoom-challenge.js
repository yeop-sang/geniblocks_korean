import React, { Component, PropTypes } from 'react';
import iframePhone from 'iframe-phone';

export default class ZoomChallenge extends Component {

  static backgroundClasses = 'fv-layout fv-layout-zoom'

  componentDidMount() {
    var iframeElement = document.getElementById("iframe");
    var phone = new iframePhone.ParentEndpoint(iframeElement);
    phone.addListener('challengeWin', this.props.onWinZoomChallenge);
  }

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

  static propTypes = {
    onWinZoomChallenge: PropTypes.func.isRequired
  }

}
