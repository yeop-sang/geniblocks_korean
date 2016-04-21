/**
 * Case 5 Certification Challenge
 *
 * The code in this module was written to support a recreation of the certification
 * challenge from Case 5 in Geniverse. The challenge is to choose a set of alleles
 * for the mother drake, breed a clutch of offspring, and then use the results to
 * deduce the alleles of the father drake.
 */
/* global DrakeGenomeColumn */
//import DrakeGenomeColumn from '../js/parent-genome-column';

const kHiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'],
      kFatherAlleles = "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog",
      kInitialMotherAlleles = "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      kClutchSize = 20;

/**
 * Center panel has breed button and breeding pen
 */
class BreedButtonAndPenView extends React.Component {

  static propTypes = {
    clutch: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    clutchSize: React.PropTypes.number.isRequired,
    onBreed: React.PropTypes.func.isRequired
  }

  handleBreed = () => {
    this.setState({ selectedIndex: null });
    if (this.props.onBreed)
      this.props.onBreed();
  }

  render() {
    const { clutch, clutchSize } = this.props;
    return (
      <div id='center' className='column'>
        <GeniBlocks.Button id="breed-button" label="Breed" onClick={this.handleBreed} />
        <GeniBlocks.PenStatsView id="breeding-pen" orgs={clutch} lastClutchSize={clutchSize} />
      </div>
    );
  }
}

/*
 * Right panel has father drake, "Ready to answer" button, and overlay test
 */
class Case5RightColumn extends React.Component {

  static propTypes = {
    org: React.PropTypes.object.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    testSelection: React.PropTypes.object.isRequired,
    toggleTest: React.PropTypes.func.isRequired,
    onGeneSelected: React.PropTypes.func.isRequired,
    checkAnswer: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    const { toggleTest, checkAnswer } = this.props;
    document.getElementsByClassName('toggle-test-button')[0].onclick = toggleTest;
    document.getElementsByClassName('toggle-test-button')[1].onclick = toggleTest;
    document.getElementById('submit-button').onclick = checkAnswer;
  }

  render() {
    const { org, hiddenAlleles, testSelection } = this.props;

    return(
      <div id='right' className='column'>
        {/* parent drake label */}
        <div id='father-drake-label' className='column-label'>Male Drake</div>

        <GeniBlocks.OrganismGlowView org={org} id='father' size={200} color='#FFFFAA' />
        <div id='father-genome-unknown'>?</div>
        <div id='test-wrapper'>
          <GeniBlocks.GenomeTestView id='father-genome-test'
                                    org={org} hiddenAlleles={hiddenAlleles}
                                    selection={testSelection}
                                    onSelectionChange={this.props.onGeneSelected} />
          <GeniBlocks.Button className='toggle-test-button' label="Return to Lab" />
          <GeniBlocks.Button id='submit-button' label="Submit!" />
        </div>
        <GeniBlocks.Button className='toggle-test-button' label="Ready to answer" />
      </div>);
  }
}

/*
 * Case 5 combines the mother genome (left), breeding area (center), father genome test (right)
 */
class Case5 extends React.Component {

  static propTypes = {
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    initialMotherAlleles: React.PropTypes.string.isRequired,
    fatherAlleles: React.PropTypes.string.isRequired,
    clutchSize: React.PropTypes.number
  }

  static defaultProps = {
    hiddenAlleles: [],
    clutchSize: 20
  }

  state = {
    mother: null,
    father: null,
    offspring: [],
    clutch: [],
    testSelection: {},
    isShowingTest: false
  }

  constructor(props) {
    super(props);

    /* eslint-disable react/no-direct-mutation-state */
    this.state.mother = new BioLogica.Organism(BioLogica.Species.Drake, props.initialMotherAlleles, BioLogica.FEMALE);
    this.state.father = new BioLogica.Organism(BioLogica.Species.Drake, props.fatherAlleles, BioLogica.MALE);
  }

  handleAlleleChange = (chrom, side, prevAllele, newAllele) => {
    let { mother } = this.state;
    mother.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    mother = new BioLogica.Organism(BioLogica.Species.Drake,
                                    mother.getAlleleString(),
                                    BioLogica.FEMALE);
    this.setState({ mother, offspring: [], clutch: [] });
  }

  handleBreed = () => {
    const { clutchSize } = this.props;
    let   { offspring, clutch } = this.state,
          count = clutchSize;
    clutch = [];
    while (count--) {
      var child = BioLogica.breed(this.state.mother, this.state.father);
      clutch.push(child);
      offspring.push(child);
    }
    this.setState({ offspring, clutch });
  }

  toggleTest = () => {
    let { showingTest } = this.state;
    showingTest = !showingTest;
    this.setState({ showingTest });

    var display = showingTest ? "block" : "none";
    document.getElementById("overlay").style.display = display;
    document.getElementById("test-wrapper").style.display = display;
  }

  handleGeneSelected = (gene, newValue) => {
    let { testSelection } = this.state;
    testSelection[gene.name] = newValue;
    this.setState({ testSelection });
  }

  checkAnswer = () => {
    let allSelectedAlleles = [],
        alleleString = this.state.father.getAlleleString(),
        alleleStringLength = alleleString.length,
        testAllele,
        success = true;

    // hard-coded check to see if user has made all four choices
    if (Object.keys(this.state.testSelection).length !== 4) {
      alert("First make a selection for all four genes!");
      return;
    }

    for (const geneName in this.state.testSelection) {
      const alleles = this.state.father.species.geneList[geneName].alleles,
            selectedAlleles = this.state.testSelection[geneName].split(" ").map(num => alleles[num]);
      allSelectedAlleles = allSelectedAlleles.concat(selectedAlleles);
    }
    while (success && (testAllele = allSelectedAlleles.pop())) {
      alleleString = alleleString.replace(`:${testAllele}`, "");
      if (alleleString.length === alleleStringLength) {
        success = false;
      }
      alleleStringLength = alleleString.length;
    }
    var message = success ? "That's right!" : "Sorry, that's not right";
    alert(message);
  }

  render() {
    const { hiddenAlleles, clutchSize } = this.props;
    return (
      <div className='column-wrapper'>
        <DrakeGenomeColumn
              id='left' className='column'
              drake={this.state.mother} sex='female'
              editable={true}
              hiddenAlleles={hiddenAlleles}
              onAlleleChange={this.handleAlleleChange} />
        <BreedButtonAndPenView id='center' className='column'
                              clutch={this.state.clutch} clutchSize={clutchSize}
                              onBreed={this.handleBreed}/>
        <Case5RightColumn id='right' className='column' 
                          org={this.state.father} hiddenAlleles={hiddenAlleles}
                          testSelection={this.state.testSelection}
                          toggleTest={this.toggleTest}
                          onGeneSelected={this.handleGeneSelected}
                          checkAnswer={this.checkAnswer} />
      </div>
    );
  }
}

/*
 * Global render function
 */
function render() {
 
  // Render Case5
  ReactDOM.render(
    React.createElement(Case5, {
      hiddenAlleles: kHiddenAlleles,
      fatherAlleles: kFatherAlleles,
      initialMotherAlleles: kInitialMotherAlleles,
      clutchSize: kClutchSize
    }),
    document.getElementById('wrapper')
  );
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
