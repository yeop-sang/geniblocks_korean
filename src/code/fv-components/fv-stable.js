import React, {PropTypes} from 'react';
import StableDrakeView from './stable-drake';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the stable by this amount
 *                        per row, crowding the org images as needed.
 */
const FVStableView = ({orgs, idPrefix='organism-', height=218, tightenRows=0, tightenColumns=0, onClick}) => {

  function handleClick(id, org) {
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  let stableDrakeHeight = height * (5/8),
      stableDrakeViews = orgs.map((org, index) => {
        return <StableDrakeView org={org} id={idPrefix + index} index={index} key={index}
                                height={stableDrakeHeight} onClick={handleClick} />;
      });

  return (
    <div className="geniblocks fv-stable">
      <div className="stable-text">{"Stable Count:" + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + orgs.length + " / 5"}</div>
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
