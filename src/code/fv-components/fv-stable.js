import React, {PropTypes} from 'react';
import FVStableCounter from './stable-counter';
import OrganismView from '../components/organism';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the stable by this amount
 *                        per row, crowding the org images as needed.
 */
const FVStableView = ({orgs, idPrefix='organism-', height=218, onClick}) => {

  function handleClick(id, org) {
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  let stableDrakeWidth = height * (5/8),
      stableDrakeViews = orgs.map((org, index) => {
        return (
          <div className="stable-drake-overlay">
            <OrganismView org = {org} id = {idPrefix + index} width = {stableDrakeWidth} onClick = {handleClick} />
          </div>
        );
      });

  return (
    <div className="geniblocks fv-stable">
      <FVStableCounter count={orgs.length} maxCount={5}/>
      <div className="stable-drakes">
        { stableDrakeViews }
      </div>
    </div>
  );
};

FVStableView.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  height: PropTypes.number,
  rows: PropTypes.number,
  tightenColumns: PropTypes.number,
  tightenRows: PropTypes.number,
  SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default FVStableView;
