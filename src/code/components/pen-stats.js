import PenView from './pen';
import StatsView from './stats';

class PenStatsView extends React.Component {

  static propTypes = {
    orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    lastClutchSize: React.PropTypes.number.isRequired,
    selectedIndex: React.PropTypes.number,
    onSelectionChange: React.PropTypes.func
  }

  render = () => {
    const { orgs, lastClutchSize, selectedIndex, onSelectionChange, ...others } = this.props,
          lastClutch = orgs.slice(-lastClutchSize);

    /* global ReactSimpleTabs */
    return (
      <ReactSimpleTabs>
        <ReactSimpleTabs.Panel title="Breeding Pen" key="Breeding Pen">
          <GeniBlocks.PenView
                        orgs={lastClutch} {...others}
                        selectedIndex={selectedIndex}
                        onClick={(evt, iSelectedIndex) => {
                          if (onSelectionChange)
                            onSelectionChange(iSelectedIndex);
                        }} />
        </ReactSimpleTabs.Panel>
        <ReactSimpleTabs.Panel title="Stats" key="Stats">
          <GeniBlocks.StatsView orgs={orgs} lastClutchSize={lastClutchSize} />
        </ReactSimpleTabs.Panel>
      </ReactSimpleTabs>
    );
  }
}

export default PenStatsView;
