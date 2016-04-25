/**
 * Case 1
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 1 in Geniverse. The challenges are:
 *  Challenge 0: Match the phenotype of a visible test drake to that of a target drake
 *               (This challenge is not in Geniverse but it was deemed a useful addition.)
 *  Challenge 1: Match the phenotype of a hidden test drake to that of a target drake
 *  Challenge 2: Match the phenotype of three hidden test drakes to target drakes
 */
/* global Case1Playground, Case1Challenge */

const kSexLabels = ['male', 'female'],
      kInitialAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      kHiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'],
      gChallengeSpecs = [
        { label: 'playground', Component: Case1Playground, isDrakeHidden: false, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-0', Component: Case1Challenge, isDrakeHidden: false, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-1', Component: Case1Challenge, isDrakeHidden: true, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-2', Component: Case1Challenge, isDrakeHidden: true, trialCount: 3,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }
      ];

class Case1 extends React.Component {

  static propTypes = {
    challengeSpecs: React.PropTypes.arrayOf(
                      React.PropTypes.shape({
                        label: React.PropTypes.string.isRequired,
                        Component: React.PropTypes.func.isRequired,
                        isDrakeHidden: React.PropTypes.bool.isRequired,
                        trialCount: React.PropTypes.number.isRequired,
                        drakeAlleles: React.PropTypes.string.isRequired,
                        hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
                      }))
  }

  constructor() {
    super();

    this.state = {
      currChallenge: 0
    };
  }

  getChallengeCount() {
    return this.props.challengeSpecs.length;
  }

  getLastChallengeIndex() {
    return this.props.challengeSpecs.length - 1;
  }

  handleAdvanceChallenge = () => {
    const lastChallenge = this.getLastChallengeIndex();
    let { currChallenge } = this.state;
    if (currChallenge < lastChallenge)
      this.setState({ currChallenge: ++currChallenge });
    else
      this.completeCase();
  }

  completeCase() {
    let url = window.location.href,
        nextUrl;
    const case1Index = url.indexOf('case-1');
    nextUrl = url.substr(0, case1Index);
    window.location.assign(nextUrl);
  }

  render() {
    const challengeSpec = this.props.challengeSpecs[this.state.currChallenge],
          { currChallenge } = this.state,
          lastChallenge = this.getLastChallengeIndex();
    return (
      <div>
        {(() => {
          if (challengeSpec.Component === Case1Playground) {
            return (
              <Case1Playground
                  sexLabels={kSexLabels}
                  challengeSpec={challengeSpec}
                  currChallenge={currChallenge}
                  lastChallenge={lastChallenge}
                  onAdvanceChallenge={this.handleAdvanceChallenge}/>
            );
          }
          else {
            return (
              <Case1Challenge
                  sexLabels={kSexLabels}
                  challengeSpec={challengeSpec}
                  currChallenge={currChallenge}
                  lastChallenge={lastChallenge}
                  onAdvanceChallenge={this.handleAdvanceChallenge}/>
            );
          }
        })()}
      </div>
    );
  }
}

function render() {

  ReactDOM.render(
    React.createElement(Case1, {
      challengeSpecs: gChallengeSpecs
    }),
    document.getElementById('wrapper')
  );
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
