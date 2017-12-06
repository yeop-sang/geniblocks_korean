import React, {PropTypes} from 'react';

const tutorialHighlightStyle = 'tutorial';
const pulseStyle = 'mini-pulse';

class TutorialView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      currentStep: -1,
      showMore: false
    };
    this.handleNextTutorial = this.handleNextTutorial.bind(this);
    this.handlePreviousTutorial = this.handlePreviousTutorial.bind(this);
    this.handleCloseTutorial = this.handleCloseTutorial.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
  }

  componentDidMount() {
    const { hidden } = this.props;
    let self = this;
    if (!hidden && this.props.tutorials && this.props.tutorials.length > 0) {
      setTimeout(() => {
        self.showTutorial();
      }, 1500);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.currentStep !== nextState.currentStep) {
      let tutorialStep = this.props.tutorials[nextState.currentStep];
      if (tutorialStep) {
        this.showTutorialHighlights(tutorialStep);
      }
    }
  }

  showTutorial() {
    if (!this.state.isVisible) {
      this.handleNextTutorial();
      this.setState({ isVisible: true });
    }
  }

  handleNextTutorial() {
    const { currentStep } = this.state;
    if (currentStep < this.props.tutorials.length - 1) {
      let nextStep = currentStep + 1;
      this.setState({ 
        currentStep: nextStep,
        showMore: false 
      });
    }
  }

  handlePreviousTutorial() {
    const { currentStep } = this.state;
    if (currentStep > 0) {
      let nextStep = currentStep - 1;
      this.setState({ 
        currentStep: nextStep,
        showMore: false 
      });
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

  handleShowMore() {
    this.setState({ showMore: true });
  }

  handleCloseTutorial() {
    this.removeAllTutorialHighlights();
    this.setState({ isVisible: false, currentStep: -1 });
  }

  render() {
    const { tutorials } = this.props;
    const { isVisible, currentStep, showMore } = this.state;
    const tutorialStep = tutorials[currentStep];

    let tutorialClass = isVisible === true ? "active" : "";

    if (!tutorialStep) {
      return null;
    }

    const dialogClass = "tutorial-content " + (tutorialStep.location ? tutorialStep.location : "");

    return (
      <div id='tutorial' className={tutorialClass}>
        <div className={dialogClass}>
          <div className="tutorial-short">{tutorialStep.text}</div>
          {showMore && <div className="tutorial-long">{tutorialStep.more}</div>}
          {!showMore && <div className="tutorial-show-more" onClick={this.handleShowMore}>(Click to show more)</div>}
          <div className="forward-back-buttons">
            {currentStep > 0 &&
              <div className="tutorial-navigate prev" onClick={this.handlePreviousTutorial}>Back</div>
            }
            {currentStep < tutorials.length - 1 &&
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
  hidden: PropTypes.bool,
  tutorials: PropTypes.array
};

export default TutorialView;
