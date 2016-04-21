/**
 * Case 3 Challenges
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 3 in Geniverse. The challenges are:
 *  Challenge 1: Modify mother drake so as to breed a particular target drake
 *  Challenge 2: Modify father drake so as to breed a pair of target drakes
 */
/* global DrakeGenomeColumn */
//import DrakeGenomeColumn from '../js/parent-genome-column';

const MALE = 0,
      FEMALE = 1,
      minChallenge = 1,
      maxChallenge = 2,
      challengeSpecs = {
        '1': {  // Challenge 1: female is editable, male is fixed, one target drake
          targetDrakeCount: 1,
          fixedParentSex: MALE,
          editableParentSex: FEMALE
        },
        '2': {  // Challenge 2: male is editable, female is fixed, two target drakes
          targetDrakeCount: 2,
          fixedParentSex: FEMALE,
          editableParentSex: MALE
        }
      },
      organismAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      hiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'],
      changeableAlleles = ['m','w','fl','hl'],
      glowColor = '#FFFFAA',
      dropGlowColor = '#FFFF00',
      matchedColor = '#88FF88',
      targetDrakeSize = 150,
      clutchSize = 20;

function parseQueryString(queryString) {
    let params = {}, queries, tmp, i, l;

    // Split into key/value pairs
    queries = queryString.split('&');

    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        tmp = queries[i].split('=');
        params[tmp[0]] = tmp[1];
    }

    return params;
}

// URL param is used to choose challenge
const urlParams = parseQueryString((window.location.search).substring(1)),
      challengeParam = urlParams.challenge && Number(urlParams.challenge),
      challenge = (challengeParam >= minChallenge) && (challengeParam <= maxChallenge) ? challengeParam : 1;

 /* global ReactDnD, ReactDnDHTML5Backend */
const DragDropContext = ReactDnD.DragDropContext,
      DragDropBackend = ReactDnDHTML5Backend;

/**
 * DragOrganismGlowView - ReactDnD.DragSource for dragging organism from breeding pen.
 */
const _DragOrganismGlowView = ({connectDragSource, ...others}) => {
  return connectDragSource(
    <div>
      <GeniBlocks.GlowBackgroundView ChildComponent={GeniBlocks.OrganismView} {...others} />
    </div>
  );
};

_DragOrganismGlowView.propTypes = {
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

const DragOrganismGlowView = ReactDnD.DragSource(
                          'organism',
                          { // drag source specification
                            beginDrag: function(props) {
                              const { org, id, index } = props;
                              return { org, id, index };
                            }
                          },
                          // collecting function
                          function(connect, monitor) {
                            return {
                              connectDragSource: connect.dragSource(),
                              wrapper: connect.dragPreview(),
                              isDragging: monitor.isDragging()
                            };
                          }
                        )(_DragOrganismGlowView);

/**
 * DropOrganismGlowView - ReactDnD.DropTarget for accepting drops on target drakes.
 */
const _DropOrganismGlowView = ({color, dropColor, connectDropTarget, isOver, canDrop, ...others}) => {
  const glowColor = isOver && canDrop ? dropColor : color;
  return connectDropTarget(
    <div>
      <GeniBlocks.GlowBackgroundView color={glowColor} ChildComponent={GeniBlocks.OrganismView} {...others} />
    </div>
  );
};

_DropOrganismGlowView.propTypes = {
  color: React.PropTypes.string.isRequired,
  dropColor: React.PropTypes.string.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,
  onDrop: React.PropTypes.func.isRequired
};

const DropOrganismGlowView = ReactDnD.DropTarget(
                          'organism',
                          { // drop target specification
                            canDrop: function(props) {
                              return !props.isMatched;
                            },
                            drop: function(props, monitor) {
                              const { org, id } = props,
                                    dropTarget = { org, id };
                              if (props.onDrop)
                                props.onDrop(monitor.getItem(), dropTarget);
                            }
                          },
                          // collecting function
                          function(connect, monitor) {
                            return {
                              connectDropTarget: connect.dropTarget(),
                              isOver: monitor.isOver(),
                              canDrop: monitor.canDrop()
                            };
                          }
                        )(_DropOrganismGlowView);

/**
 * Center panel has target drakes, breedng pen, breed button, etc.
 */
class _Case3Center extends React.Component {

  static propTypes = {
    targetDrakes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    targetsMatched: React.PropTypes.object.isRequired,
    targetDrakeSize: React.PropTypes.number.isRequired,
    glowColor: React.PropTypes.string.isRequired,
    matchedColor: React.PropTypes.string.isRequired,
    clutch: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    clutchSize: React.PropTypes.number.isRequired,
    onBreed: React.PropTypes.func.isRequired,
    requiredMoveCount: React.PropTypes.number.isRequired,
    moveCount: React.PropTypes.number.isRequired,
    onDrop: React.PropTypes.func.isRequired
  }

  state = {
    selectedIndex: null
  }

  constructor(props) {
    super(props);
    document.addEventListener('keydown', () => enableButtonFocusHighlight());
  }

  handleSelectionChange = (iSelectedIndex) => {
    this.setState({ selectedIndex: iSelectedIndex });
  }

  handleBreed = () => {
    this.setState({ selectedIndex: null });
    if (this.props.onBreed)
      this.props.onBreed();
  }

  renderTargetDrake(index) {
    const { targetDrakes, targetsMatched, targetDrakeSize,
            glowColor, matchedColor } = this.props,
          id = `target-drake-${index}`,
          isMatched = targetsMatched.has(id),
          color = isMatched ? matchedColor : glowColor;
    return index < targetDrakes.length
            ? <DropOrganismGlowView
                id={id} className="small-drake-image"
                org={targetDrakes[index]} size={targetDrakeSize}
                color={color} dropColor={dropGlowColor}
                isMatched={isMatched} onDrop={this.props.onDrop} />
            : null;
  }

  render() {
    const { targetDrakes, clutch, clutchSize, requiredMoveCount, moveCount } = this.props,
          targetDrakeCount = targetDrakes.length,
          targetDrakesLabel = targetDrakeCount === 1 ? "Target Drake" : "Target Drakes";
    return (
      <div id="center" className="column">
        <div id="target-drakes-label" className="column-label">{targetDrakesLabel}</div>
        <div id="target-drakes">
          {this.renderTargetDrake(0)}
          {this.renderTargetDrake(1)}
        </div>
        <div id="breed-button-and-goal-feedback">
          <button id="breed-button"
                  onClick={this.handleBreed}
                  onMouseOver={suppressButtonFocusHighlight}
                  onMouseDown={suppressButtonFocusHighlight} >
            Breed
          </button>
          <GeniBlocks.FeedbackView id="goal-feedback" className="feedback-view"
                                    text={[
                                      `GOAL is ${requiredMoveCount} MOVES`,
                                      `Your moves: ${moveCount}`
                                    ]} />
        </div>
        <GeniBlocks.PenStatsView id="breeding-pen" orgs={clutch} lastClutchSize={clutchSize}
                                  selectedIndex={this.state.selectedIndex}
                                  SelectedOrganismView={DragOrganismGlowView}
                                  onSelectionChange={this.handleSelectionChange}/>
        <div id="alert-wrapper">
          <h3 id="alert-title"></h3>
          <div id="alert-message"></div>
          <button id="alert-try-button">Try Again</button>
          <button id="alert-ok-button">OK</button>
        </div>
      </div>
    );
  }
}
const Case3Center = DragDropContext(DragDropBackend)(_Case3Center);

/**
 * Case 3 combines left column (mother drake), center column (target drakes, breed button,
 * breeding pen), and right column (father drake).
 */
class Case3 extends React.Component {

  static propTypes = {
    challenge: React.PropTypes.object.isRequired
  }

  state = {
    parentDrakes: [],
    targetParentDrake: null,
    targetDrakes: [],
    clutch: [],
    requiredMoveCount: 0,
    moveCount: 0,
    targetsMatched: null
  }

  componentWillMount() {
    this.reset();
  }

  reset = () => {
    const { targetDrakeCount, fixedParentSex, editableParentSex } = this.props.challenge;
    let parentDrakes = [],
        targetParentDrake,
        targetDrakes = [],
        targetsMatched = new Set,
        clutch = [],
        requiredMoveCount = 0,
        moveCount = 0;
    // regenerate if we generate drakes that are too close to/far from each other
    while ((requiredMoveCount < 4) || (requiredMoveCount > 8)) {
      parentDrakes = [];
      for (let sex = MALE; sex <= FEMALE; ++sex) {
        parentDrakes.push(new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, sex));
      }
      targetParentDrake = new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, editableParentSex);
      const targetMother = fixedParentSex === FEMALE ? parentDrakes[FEMALE] : targetParentDrake,
            targetFather = fixedParentSex === MALE ? parentDrakes[MALE] : targetParentDrake;
      targetDrakes = [];
      requiredMoveCount = 0;
      for (let i=0; i<targetDrakeCount; ++i) {
        targetDrakes.push(BioLogica.breed(targetMother, targetFather));
        // We're approximating the combined required move count from the moves required to
        // reach each target offspring independently. Eventually, need a better means of
        // determining the moves required to reach a single parent that can produce all
        // of the necessary target offspring.
        requiredMoveCount = Math.max(requiredMoveCount,
                                      GeniBlocks.GeneticsUtils.
                                        numberOfBreedingMovesToReachDrake(
                                          parentDrakes[MALE], parentDrakes[FEMALE],
                                          editableParentSex === MALE ? changeableAlleles : [],
                                          editableParentSex === FEMALE ? changeableAlleles : [],
                                          targetDrakes[i]));
      }
      // add one for dragging an offspring to each target drake
      requiredMoveCount += targetDrakeCount;
    }
    this.setState({ parentDrakes, targetParentDrake, targetDrakes, targetsMatched,
                    clutch, requiredMoveCount, moveCount });
  }

  handleAlleleChange = (sex, chrom, side, prevAllele, newAllele) => {
    let parentDrakes = this.state.parentDrakes.slice(),
        drake = parentDrakes[sex];
    drake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
    parentDrakes[sex] = drake;
    this.setState({ parentDrakes, clutch: [], moveCount: ++this.state.moveCount });
  }

  handleBreed = () => {
    let { parentDrakes } = this.state,
        clutch = [];
    for (let i = 0; i < clutchSize; ++i) {
      clutch.push(BioLogica.breed(parentDrakes[FEMALE], parentDrakes[MALE]));
    }
    this.setState({ clutch });
  }

  handleDrop = (dragItem, dropTarget) => {
    this.setState({ moveCount: ++this.state.moveCount });

    if (0 === GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(dragItem.org, dropTarget.org)) {
      this.setState((state) => ({ targetsMatched: new Set(state.targetsMatched).add(dropTarget.id) }));
      if (this.state.targetsMatched.size >= this.state.targetDrakes.length) {
        showAlert(true, {
          title: "Good Work!",
          message: "The drake you have created matches the target drake.",
          okButton: challenge < maxChallenge ? "Next Challenge" : "Case Log",
          okCallback: nextChallenge,
          tryButton: "Try Again",
          tryCallback: this.reset
        });
      }
      else {
        showAlert(true, {
          title: "Good Work!",
          message: "The drake you have created matches the target drake.",
          okButton: "OK"
        });
      }
    }
    else {
      showAlert(true, {
        title: "That's not the drake!",
        message: "The drake you have created doesn't match the target drake.\nPlease try again.",
        tryButton: "Try Again"
      });
    }
  }

  render() {
    const { editableParentSex } = this.props.challenge,
          { parentDrakes, targetDrakes, targetsMatched,
            clutch, requiredMoveCount, moveCount } = this.state;

    const handleMotherAlleleChange = function(...args) {
      this.handleAlleleChange(FEMALE, ...args);
    }.bind(this);

    const handleFatherAlleleChange = function(...args) {
      this.handleAlleleChange(MALE, ...args);
    }.bind(this);

    return (
      <div id="challenges-wrapper">
        <DrakeGenomeColumn
              id='left' sex='female'
              drake={parentDrakes[FEMALE]}
              editable={editableParentSex === FEMALE}
              hiddenAlleles={hiddenAlleles}
              onAlleleChange={handleMotherAlleleChange} />
        <Case3Center
              targetDrakes={targetDrakes} targetDrakeSize={targetDrakeSize}
              targetsMatched={targetsMatched}
              glowColor={glowColor} matchedColor={matchedColor}
              clutch={clutch} clutchSize={clutchSize}
              onBreed={this.handleBreed}
              onDrop={this.handleDrop}
              requiredMoveCount={requiredMoveCount} moveCount={moveCount} />
        <DrakeGenomeColumn
              id='right' sex='male'
              drake={parentDrakes[MALE]}
              editable={editableParentSex === MALE}
              hiddenAlleles={hiddenAlleles}
              onAlleleChange={handleFatherAlleleChange} />
      </div>
    );
  }
}

function render() {
  ReactDOM.render(
    React.createElement(Case3, { challenge: challengeSpecs[challenge] }),
    document.getElementById('wrapper')
  );
}

function nextChallenge() {
  let url = window.location.href,
      nextUrl;
  if (challenge < maxChallenge) {
    // advance to next challenge
    nextUrl = url.replace(`challenge=${challenge}`, `challenge=${challenge+1}`);
  }
  else {
    // back to case log
    const case3Index = url.indexOf('case-3');
    nextUrl = url.substr(0, case3Index);
  }
  window.location.assign(nextUrl);
}

let alertClientButtonClickHandlers = {};
function showAlert(iShow, iOptions) {
  const displayMode = iShow ? 'block' : 'none',
        okButton = document.getElementById("alert-ok-button"),
        tryButton = document.getElementById("alert-try-button");
  if (iShow) {
    document.getElementById("alert-title").innerHTML = iOptions.title || "";
    document.getElementById("alert-message").innerHTML = iOptions.message || "";
    okButton.innerHTML = iOptions.okButton || "";
    okButton.style.display = iOptions.okButton ? 'block' : 'none';
    okButton.dataset.okCallback = iOptions.okCallback || '';
    alertClientButtonClickHandlers[okButton.id] = iOptions.okCallback || null;
    tryButton.innerHTML = iOptions.tryButton || "";
    tryButton.style.display = iOptions.tryButton ? 'block' : 'none';
    alertClientButtonClickHandlers[tryButton.id] = iOptions.tryCallback || null;
    okButton.onclick = alertButtonClickHandler;
    tryButton.onclick = alertButtonClickHandler;
  }
  else {
    alertClientButtonClickHandlers[okButton.id] = null;
    alertClientButtonClickHandlers[tryButton.id] = null;
  }
  //document.getElementById("overlay").style.display = displayMode;
  document.getElementById("alert-wrapper").style.display = displayMode;
}

function alertButtonClickHandler(evt) {
  const clientClickHandler = alertClientButtonClickHandlers[evt.target.id];
  showAlert(false);
  if (clientClickHandler)
    clientClickHandler();
  render();
}

// prevent extraneous focus highlight on click while maintaining keyboard accessibility
// see https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
function suppressButtonFocusHighlight(evt) {
  const noFocusHighlight = 'no-focus-highlight';
  if (evt.target.className.indexOf(noFocusHighlight) < 0)
    evt.target.className += ' ' + noFocusHighlight;
}

function enableButtonFocusHighlight() {
  const button = document.getElementById('breed-button');
  // cf. http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
  if (button && button.className)
    button.className = button.className.replace(/(?:^|\s)no-focus-highlight(?!\S)/g , '');
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
