import React, { Component, PropTypes } from 'react';
import iframePhone from 'iframe-phone';
var phone;

export default class ZoomChallenge extends Component {

  static backgroundClasses = 'fv-layout fv-layout-zoom'

  componentDidMount() {
    var iframeElement = document.getElementById("iframe");
    phone = new iframePhone.ParentEndpoint(iframeElement);
    phone.addListener('challengeWin', this.props.onWinZoomChallenge);
  }

  componentWillUnmount() {
    phone.disconnect();
  }

  render() {
    let url = this.props.zoomUrl;
    if (window.location.href.indexOf('/branch/staging') > -1 ) url = this.props.zoomUrl + "&staging=true";

    return (
      <div id="zoom-challenge-container">
        <iframe id="iframe" src={ url } />
      </div>
    );
  }

  static authoredDrakesToDrakeArray = function() {
    return [];
  }

  static propTypes = {
    onWinZoomChallenge: PropTypes.func.isRequired,
    zoomUrl: PropTypes.string.isRequired
  }

}
