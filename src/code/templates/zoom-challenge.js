import React, { Component, PropTypes } from 'react';
import iframePhone from 'iframe-phone';
var phone;

export default class ZoomChallenge extends Component {

  static backgroundClasses = 'fv-layout fv-layout-zoom'

  componentDidMount() {
    var iframeElement = document.getElementById("iframe");
    phone = new iframePhone.ParentEndpoint(iframeElement);
    phone.addListener('challengeWin', this.props.onWinZoomChallenge);
    phone.addListener('activityLoaded', () => { console.log("loaded!");});
  }

  componentWillUnmount() {
    phone.disconnect();
  }

  render() {
    let url = this.props.zoomUrl;
    let tempStyle = {
      width: '30px',
      height: '30px',
      position: 'fixed',
      bottom: '30px',
      backgroundColor: 'gold',
      borderRadius: '18px',
      textAlign: 'center',
      lineHeight: '1.5em',
      color: 'black',
      fontWeight: 'bold',
      border: '1px solid orange',
      zIndex: 20,
      cursor: 'pointer'
    };
    if (window.location.href.indexOf('/branch/staging') > -1 ) url = this.props.zoomUrl + "&staging=true";
    function togglePopups() {
      console.log('toggle');
      phone.post('togglePopups');
    }
    return (
      <div id="zoom-challenge-container">
        <iframe id="iframe" src={url} />
        <div id="toggle-popups" style={tempStyle} onClick={togglePopups}>?</div>
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
