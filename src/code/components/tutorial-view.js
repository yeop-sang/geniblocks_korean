import React, {PropTypes} from 'react';

const tutorialHighlightStyle = 'tutorial';
const pulseStyle = 'mini-pulse';

class TutorialView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowing: false
    };
    const { onTutorialNext, onTutorialPrevious, onTutorialMore, onTutorialClosed } = this.props;
    this.handleNextTutorial =  onTutorialNext;
    this.handlePreviousTutorial = onTutorialPrevious;
    this.handleShowMore = onTutorialMore;
    this.handleCloseTutorial = onTutorialClosed;
  }

  componentDidMount() {
    const { visible, steps } = this.props;
    let self = this;
    if (visible && steps && steps.length > 0) {
      // the first time we mount on a page, wait a little before showing first tutorial
      setTimeout(() => {
        self.setState({ isShowing: true });
      }, 1500);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.currentStep !== nextProps.currentStep ||
        this.state.isShowing !== nextState.isShowing) {
      let tutorialStep = this.props.steps[nextProps.currentStep];
      if (tutorialStep) {
        this.showTutorialHighlights(tutorialStep);
      }
    }
    if (this.props.visible !== nextProps.visible && !nextProps.visible) {
      this.removeAllTutorialHighlights();
    }
  }

  showTutorialHighlights(tutorialStep) {
    this.addClass(tutorialStep.element, tutorialHighlightStyle);
    if (tutorialStep.pulseElement) {
      this.addClass(tutorialStep.pulseElement, pulseStyle);
    } else {
      this.addClass(tutorialStep.element, pulseStyle);
    }
  }

  removeAllTutorialHighlights() {
    this.removeClassFromAllElements(tutorialHighlightStyle);
    this.removeClassFromAllElements(pulseStyle);
  }

  removeClassFromAllElements(className) {
    let elements = document.getElementsByClassName(className);
    for (let i = elements.length - 1; i > -1; i--){
      elements[i].classList.remove(className);
    }
  }

  addClass(elClassName, newClassName) {
    this.removeClassFromAllElements(newClassName);
    setTimeout(() => {
      let elements = document.getElementsByClassName(elClassName);
      for (let i = 0; i < elements.length; i++){
        elements[i].classList.add(newClassName);
      }
    }, 200);
  }

  render() {
    const { steps, visible, currentStep, moreVisible } = this.props;
    const { isShowing } = this.state;
    const tutorialStep = steps[currentStep];

    if (!visible || !isShowing || !tutorialStep) {
      return null;
    }

    const dialogClass = "tutorial-content " + (tutorialStep.location ? tutorialStep.location : "");

    const more = moreVisible ? 
      <div className="tutorial-long">{tutorialStep.more}</div> : 
      <div className="tutorial-show-more" onClick={this.handleShowMore}>(Click to show more)</div>;

    return (
      <div id='tutorial'>
        <div className={dialogClass}>
          <div className="tutorial-short">{tutorialStep.text}</div>
          {more}
          <div className="forward-back-buttons">
            {currentStep > 0 &&
              <div className="tutorial-navigate prev" onClick={this.handlePreviousTutorial}>Back</div>
            }
            {currentStep < steps.length - 1 &&
              <div className="tutorial-navigate next" onClick={this.handleNextTutorial}>Next</div>
            }
          </div>
          <div className="tutorial-close" onClick={this.handleCloseTutorial}>X</div>
        </div>
      </div>
    );
  }
}

TutorialView.propTypes = {
  visible: PropTypes.bool,
  steps: PropTypes.array,
  currentStep: PropTypes.number,
  moreVisible: PropTypes.bool,
  onTutorialMore: PropTypes.func,
  onTutorialNext: PropTypes.func,
  onTutorialPrevious: PropTypes.func,
  onTutorialClosed: PropTypes.func
};

export default TutorialView;
