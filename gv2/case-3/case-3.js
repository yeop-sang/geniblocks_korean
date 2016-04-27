/**
 * Case 3 Challenges
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 3 in Geniverse. The challenges are:
 *  Challenge 1: Modify mother drake so as to breed a particular target drake
 *  Challenge 2: Modify father drake so as to breed a pair of target drakes
 */
/* global Case3Challenge */
const { MALE, FEMALE } = BioLogica,
      kInitialAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      kHiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'],
      kEditableAlleles = ['m','w','fl','hl'],
      kChallengeSpecs = [
        { // Challenge 1: female is editable, male is fixed, one target drake
          label: 'challenge-1',
          targetDrakeCount: 1,
          fixedParentSex: MALE,
          editableParentSex: FEMALE,
          initialAlleles: kInitialAlleles,
          hiddenAlleles: kHiddenAlleles,
          editableAlleles: kEditableAlleles
        },
        { // Challenge 2: male is editable, female is fixed, two target drakes
          label: 'challenge-2',
          targetDrakeCount: 2,
          fixedParentSex: FEMALE,
          editableParentSex: MALE,
          initialAlleles: kInitialAlleles,
          hiddenAlleles: kHiddenAlleles,
          editableAlleles: kEditableAlleles
        }
      ],
      kGlowColor = '#FFFFAA',
      kDropGlowColor = '#FFFF00',
      kCorrectGlowColor = '#88FF88',
      kIncorrectGlowColor = '#FF8888',
      kTargetDrakeSize = 150,
      kClutchSize = 20;

function handleCompleteCase() {
  // back to case log
  let url = window.location.href;
  const case3Index = url.indexOf('case-3'),
        nextUrl = url.substr(0, case3Index);
  window.location.assign(nextUrl);
}

class Case3 extends React.Component {

  static propTypes = {
    challengeSpecs: React.PropTypes.arrayOf(React.PropTypes.object),
    onCompleteCase: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      currChallenge: 0
    };
  }

  handleNextChallenge = () => {
    const maxChallenge = this.props.challengeSpecs.length - 1;
    if (this.state.currChallenge < maxChallenge) {
      // advance to next challenge
      this.setState({ currChallenge: this.state.currChallenge + 1 });
    }
    else {
      // back to case log
      this.props.onCompleteCase();
    }
  }

  render() {
    const { challengeSpecs } = this.props,
          { currChallenge } = this.state,
          challengeSpec = challengeSpecs[currChallenge],
          maxChallenge = challengeSpecs.length - 1;
    return (
      <Case3Challenge currChallenge={currChallenge} maxChallenge={maxChallenge}
                      challengeSpec={challengeSpec}
                      targetDrakeSize={kTargetDrakeSize} clutchSize={kClutchSize}
                      glowColor={kGlowColor} dropGlowColor={kDropGlowColor}
                      correctGlowColor={kCorrectGlowColor} incorrectGlowColor={kIncorrectGlowColor}
                      onNextChallenge={this.handleNextChallenge}/>
    );
  }
}

function render() {
  ReactDOM.render(
    React.createElement(Case3, {
      challengeSpecs: kChallengeSpecs,
      onCompleteCase: handleCompleteCase }),
    document.getElementById('wrapper')
  );
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
