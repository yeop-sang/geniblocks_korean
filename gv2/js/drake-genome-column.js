/**
 * DrakeGenomeColumn - shows drake image and genome
 */
/* exported DrakeGenomeColumn */
class DrakeGenomeColumn extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    sex: React.PropTypes.string.isRequired,
    drake: React.PropTypes.object.isRequired,
    isDrakeEditable: React.PropTypes.bool.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    alleleChanged: React.PropTypes.func.isRequired
  }

  render() {
    const { id, sex, drake, isDrakeEditable, hiddenAlleles, alleleChanged } = this.props,
          drakeLabelID = `${sex}-drake-label`,
          columnLabel = `${sex.charAt(0).toUpperCase() + sex.slice(1)} Drake`,
          drakeOrgID = `${sex}-drake`;
    return (
      <div id={id} className="column">

        {/* parent drake label */}
        <div id={drakeLabelID} className="column-label">{columnLabel}</div>

        {/* parent drake image */}
        <GeniBlocks.OrganismGlowView
          id={drakeOrgID} className='parent-drake' org={drake} color='#FFFFAA' size={200} />

        {/* parent drake genome */}
        <GeniBlocks.GenomeView
          className='parent-genome' org={drake} hiddenAlleles={hiddenAlleles}
          editable={isDrakeEditable} alleleChanged={alleleChanged} />
      </div>
    );
  }
}

DrakeGenomeColumn;
//export default DrakeGenomeColumn;
