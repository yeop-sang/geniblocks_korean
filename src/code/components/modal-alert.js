/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import Modal from 'react-overlays/lib/Modal';
import Button from './button';
import ChallengeAwardView from './challenge-award';
import React, { PropTypes } from 'react';

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

const dialogStyle = function() {
  // we use some psuedo random coords so nested modals
  // don't sit right on top of each other.
  let top = 50;
  let left = 50;
  return {
    position: 'absolute',
    width: 400,
    top: top + '%', left: left + '%',
    transform: `translate(-${top}%, -${left}%)`,
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20
  };
};


class ModalAlert extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    explanation: PropTypes.string,
    leftButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func
    }),
    rightButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func
    }),
    onHide: PropTypes.func,
    onLeftButtonClick: PropTypes.func,        // optional click handlers if not defined
    onRightButtonClick: PropTypes.func,       // in button props. (Better for `mapDispatchToProps`)
    challengeAwards: PropTypes.object
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
                                  onClick={leftProps.onClick || this.props.onLeftButtonClick}/>
                        : null,
          rightProps = this.props.rightButton || {},
          rightButton = <Button label={rightProps.label || ""}
                                onClick={rightProps.onClick || this.props.onRightButtonClick}/>;
    var awardView;
    if (this.props.challengeAwards){
      awardView = <ChallengeAwardView challengeAwards={this.props.challengeAwards} />;
    }
    return (
      <Modal  aria-labelledby='modal-label'
              style={modalStyle}
              backdropStyle={backdropStyle}
              show={this.props.show}
              onHide={this.props.onHide} >
        <div style={dialogStyle()} >
          <h4 id='modal-label'>{this.props.message}</h4>
          {awardView}
          <p>{this.props.explanation}</p>
          {leftButton} {rightButton}
        </div>
      </Modal>
    );
  }
}

export default ModalAlert;

