/**
 * DrakeGenomeColumn - shows drake image and genome
 */
/* exported DrakeGenomeColumn */
class DrakeGenomeColumn extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    sex: React.PropTypes.string.isRequired,
    drake: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    onAlleleChange: React.PropTypes.func.isRequired,
    buttonID: React.PropTypes.string,
    buttonLabel: React.PropTypes.string,
    onButtonClick: React.PropTypes.func
  }

  render() {
    const { id, sex, drake, editable, hiddenAlleles,
            buttonID, buttonLabel } = this.props,
          drakeLabelID = `${sex}-drake-label`,
          columnLabel = `${sex.charAt(0).toUpperCase() + sex.slice(1)} Drake`,
          drakeOrgID = `${sex}-drake`,
          button = buttonID
                    ? <GeniBlocks.Button id={buttonID} onClick={this.props.onButtonClick}>
                        {buttonLabel}
                      </GeniBlocks.Button>
                    : null;
    return (
      <div id={id} className="column">

        {/* drake label */}
        <div id={drakeLabelID} className="column-label">{columnLabel}</div>

        {/* drake image */}
        <GeniBlocks.OrganismGlowView
          id={drakeOrgID} className='parent-drake' org={drake} color='#FFFFAA' size={200} />

        {/* drake genome */}
        <GeniBlocks.GenomeView
          className='parent-genome' org={drake} hiddenAlleles={hiddenAlleles}
          editable={editable} onAlleleChange={this.props.onAlleleChange} />

        {/* optional button */}
        {button}
      </div>
    );
  }
}

DrakeGenomeColumn;
//export default DrakeGenomeColumn;
