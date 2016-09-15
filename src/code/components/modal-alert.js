/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import Modal from 'react-overlays/lib/Modal';
import Button from './button';
import ChallengeAwardView from './challenge-award';
import React, { PropTypes } from 'react';
import t from '../utilities/translate';

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.1
};

const dialogStyle = function(top="50%") {
  // we use some psuedo random coords so nested modals
  // don't sit right on top of each other.
  let left = 50;
  return {
    position: 'absolute',
    width: 385,
    top: top, left: left + '%',
    transform: `translate(-50%, -${left}%)`,
    backgroundImage: 'url(resources/images/parchment.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundOrigin: 'border-box',
    boxShadow: '0 10px 5px rgba(0,0,0,.5)',
    padding: 20,
    outline: 'none'
  };
};


class ModalAlert extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    message: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    explanation: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    leftButton: PropTypes.shape({
      label: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      onClick: PropTypes.func
    }),
    rightButton: PropTypes.shape({
      label: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      onClick: PropTypes.func
    }),
    onHide: PropTypes.func,
    onLeftButtonClick: PropTypes.func,        // optional click handlers if not defined
    onRightButtonClick: PropTypes.func,       // in button props. (Better for `mapDispatchToProps`)
    challengeAwards: PropTypes.object,
    top: PropTypes.string
  }

  static defaultProps = {
    show: false,
    challengeAwards: { id:0, progress: [] }
  }

  render() {
    /* eslint react/jsx-handler-names: 0 */
    const leftProps = this.props.leftButton || {},
          leftButton = leftProps.label
                        ? <Button label={leftProps.label || ""}
                                  className="alert-button"
                                  onClick={leftProps.onClick || this.props.onLeftButtonClick}/>
                        : null,
          rightProps = this.props.rightButton || {},
          rightButton = <Button label={rightProps.label || ""}
                                className="alert-button"
                                onClick={rightProps.onClick || this.props.onRightButtonClick}/>;
    var awardView, explanationView;

    if (this.props.challengeAwards){
      awardView = <ChallengeAwardView challengeAwards={this.props.challengeAwards} />;
    }
    if (this.props.explanation) {
      explanationView = <p>{t(this.props.explanation)}</p>;
    }
    return (
      <Modal  aria-labelledby='modal-label'
              style={modalStyle}
              backdropStyle={backdropStyle}
              show={this.props.show}
              onHide={this.props.onHide} >
        <div style={dialogStyle(this.props.top)} >
          <h4 id='modal-label'>{t(this.props.message)}</h4>
          {awardView}
          {explanationView}
          {leftButton} {rightButton}
        </div>
      </Modal>
    );
  }
}

export default ModalAlert;

