import Case1 from './case-1/case-1';
import Case1Challenge from './case-1/challenge';
import Case1Playground from './case-1/playground';
import Case3 from './case-3/case-3';
import Case5 from './case-5/case-5';
import CaseLog from './case-log/case-log';

const caseSpecs = [
  { title: "Case 1: Enter the Drake", className: 'case0', column: 1, 
    component: Case1, path: 'case-1/', enabled: true },
  { title: "Case 2: My, Oh Sis!", className: 'case1', column: 1,
    component: undefined, path: undefined, enabled: false },
  { title: "Case 3: In the Clutches of Drakes", className: 'case2', column: 2,
    component: Case3, path: 'case-3/', enabled: true },
  { title: "Case 4: Traits and Mates", className: 'case3', column: 2,
    component: undefined, path: undefined, enabled: false },
  { title: "Case 5: Certification", className: 'case4', column: 2,
    component: Case5, path: 'case-5/', enabled: true }
];

const { MALE, FEMALE } = BioLogica,
      kSexLabels = ['male', 'female'],
      kInitialAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      kHiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'],
      kClutchSize = 20,

      /*
       * Case 1
       */
      kCase1ChallengeSpecs = [
        { label: 'playground', Component: Case1Playground, isDrakeHidden: false, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-0', Component: Case1Challenge, isDrakeHidden: false, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-1', Component: Case1Challenge, isDrakeHidden: true, trialCount: 1,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles },
        { label: 'challenge-2', Component: Case1Challenge, isDrakeHidden: true, trialCount: 3,
          drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }
      ],

      /*
       * Case 3
       */
      kEditableAlleles = ['m','w','fl','hl'],
      kCase3ChallengeSpecs = [
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

      /*
       * Case 5
       */
      kFatherAlleles = "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog",
      kInitialMotherAlleles = "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog";

class GV2 extends React.Component {

  constructor() {
    super();
    this.state = { currState: CaseLog };
  }

  handleCaseSelected = (iComponent) => {
    this.setState({ currState: iComponent });
  }

  handleCompleteCase = () => {
    this.setState({ currState: CaseLog });
  }

  render() {
    const { currState } = this.state;
    return (
      <div>
        {(() => {
          switch (currState) {
            
            case Case1:
              return (
                <Case1 sexLabels={kSexLabels}
                        challengeSpecs={kCase1ChallengeSpecs}
                        onCompleteCase={this.handleCompleteCase}/>
              );
            
            case Case3:
              return (
                <Case3 challengeSpecs={kCase3ChallengeSpecs}
                        onCompleteCase={this.handleCompleteCase}/>
              );
            
            case Case5:
              return (
                <Case5 hiddenAlleles={kHiddenAlleles}
                        fatherAlleles={kFatherAlleles}
                        initialMotherAlleles={kInitialMotherAlleles}
                        clutchSize={kClutchSize}
                        onCompleteCase={this.handleCompleteCase}/>
              );
            
            case CaseLog:
            default:
              return (
                <CaseLog caseSpecs={caseSpecs} onCaseSelected={this.handleCaseSelected}/>
              );
          }
        })()}
      </div>
    );
  }
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

ReactDOM.render(
  React.createElement(GV2, {}), document.getElementById('wrapper')
);
