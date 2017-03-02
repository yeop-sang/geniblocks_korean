import React, {PropTypes} from 'react';
import OrganismView from '../components/organism';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the stable by this amount
 *                        per row, crowding the org images as needed.
 */
const FVStableView = ({orgs, idPrefix='organism-', width=1529, columns=5, tightenRows=0, tightenColumns=0, SelectedOrganismView=OrganismView, selectedIndex, onClick}) => {

  function handleClick(id, org) {
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  let orgStyle = {
    margin: `${-tightenRows/2}px ${-tightenColumns/2}px`
  };

  let orgWidth = width/columns,
      orgViews = orgs.map((org, index) => {
        return index === selectedIndex
                ? <SelectedOrganismView org={org} id={idPrefix + index} index={index} key={index}
                                    color="#FFFFAA" size={orgWidth} style={orgStyle} onClick={handleClick}/>
                : <OrganismView org={org} id={idPrefix + index} index={index} key={index}
                                width={orgWidth} style={orgStyle} onClick={handleClick} />;
      });

  return (
    <div className="geniblocks fv-stable">
      { orgViews }
    </div>
  );
};

FVStableView.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  width: PropTypes.number,
  columns: PropTypes.number,
  rows: PropTypes.number,
  tightenColumns: PropTypes.number,
  tightenRows: PropTypes.number,
  SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default FVStableView;
