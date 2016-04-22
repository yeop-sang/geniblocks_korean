const kSexLabels = ['male', 'female'],
      kHiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'],
      kInitialAlleles = "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      kInitialSex = BioLogica.FEMALE;

class Case1PlaygroundLeft extends React.Component {

  static propTypes = {
    sexLabels: React.PropTypes.arrayOf(React.PropTypes.string),
    drake: React.PropTypes.object.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    onSexChange: React.PropTypes.func.isRequired,
    onAlleleChange: React.PropTypes.func.isRequired
  }

  render() {
    const { sexLabels, drake, hiddenAlleles } = this.props;
    return (
      <div id='left' className='column'>
        <GeniBlocks.ChangeSexButtons id='change-sex-buttons'
          sex={sexLabels[drake.sex]} onChange={this.props.onSexChange}
          species="Drake" showLabel={true}/>
        <GeniBlocks.GenomeView id='drake-genome'
          org={drake} hiddenAlleles={hiddenAlleles} onAlleleChange={this.props.onAlleleChange}
          style={{marginTop: 50, top: 50}}/>
      </div>
    );
  }
}

class Case1PlaygroundRight extends React.Component {

  static propTypes = {
    drake: React.PropTypes.object.isRequired,
    handleProceedButton: React.PropTypes.func.isRequired
  }

  render() {
    const { drake, handleProceedButton } = this.props;
    return (
      <div id="right" className="column">
        <GeniBlocks.OrganismGlowView id='drake-image' org={drake} color='#FFFFAA' size={200}/>
        <GeniBlocks.Button id='advance-button' label="Bring It On!" onClick={handleProceedButton}/>
      </div>
    );
  }
}

class Case1Playground extends React.Component {

  static propTypes = {
    sexLabels: React.PropTypes.arrayOf(React.PropTypes.string),
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    initialAlleles: React.PropTypes.string.isRequired,
    initialSex: React.PropTypes.oneOf([BioLogica.MALE, BioLogica.FEMALE]).isRequired,
    handleProceedButton: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      drake: new BioLogica.Organism(BioLogica.Species.Drake, props.initialAlleles, props.initialSex)
    };
  }

  handleSexChange = (iSex) => {
    const { sexLabels, initialAlleles } = this.props;
    let { drake } = this.state;
    // replace alleles lost when switching to male and back
    const alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(
                          drake.genetics, drake.getAlleleString(), initialAlleles),
          sexOfDrake = sexLabels.indexOf(iSex);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, sexOfDrake);
    this.setState({ drake });
  }

  handleAlleleChange = (chrom, side, prevAllele, newAllele) => {
    let { drake } = this.state;
    drake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
    this.setState({ drake });
  }

  render() {
    const { sexLabels, hiddenAlleles, handleProceedButton } = this.props;
    const { drake } = this.state;
    return (
      <div id="playground-wrapper">
        <Case1PlaygroundLeft drake={drake} sexLabels={sexLabels}
                            hiddenAlleles={hiddenAlleles}
                            onSexChange={this.handleSexChange}
                            onAlleleChange={this.handleAlleleChange}/>
        <Case1PlaygroundRight drake={drake} handleProceedButton={handleProceedButton}/>
      </div>
    );
  }
}

function handleProceedButton() {
  window.location.assign(window.location.href.replace("playground.html", "challenges.html?challenge=0"));
}

function render() {
  ReactDOM.render(
    React.createElement(Case1Playground, {
      sexLabels: kSexLabels,
      hiddenAlleles: kHiddenAlleles,
      initialAlleles: kInitialAlleles,
      initialSex: kInitialSex,
      handleProceedButton }),
    document.getElementById('wrapper'));
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
