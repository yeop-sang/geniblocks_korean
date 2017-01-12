import React, {PropTypes} from 'react';
import { map } from 'lodash';
import GameteImageView from './gamete-image';

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the pen by this amount
 *                        per row, crowding the org images as needed.
 */
const GametePenView = ({id, sex, gametes, idPrefix='gamete-', gameteSize=1.0, width=400, columns=5, rows, tightenRows=0, tightenColumns=0, selectedIndex, onClick}) => {

  function handleClick(id, org) {
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  let eltStyle = {
    margin: `${-tightenRows/2}px ${-tightenColumns/2}px`
  };

  let eltHeight = 80 * gameteSize,
      rowHeight = eltHeight + 6,
      isEgg = sex === BioLogica.FEMALE,
      gameteDisplayStyle = { size: gameteSize },
      gameteViews = gametes.map((gamete, index) => {
        const chromosomes = map(gamete, (side, name) => { return { name, side }; }),
              className = index === selectedIndex ? 'selected' : '';
        return <GameteImageView isEgg={isEgg} chromosomes={chromosomes} key={index}
                                id={idPrefix + index} className={className}
                                style={eltStyle} displayStyle={gameteDisplayStyle}
                                onClick={handleClick}/>;
      });

  rows = rows || Math.ceil(gameteViews.length / columns) || 1;

  let height = rowHeight * rows,
      style = { width, height };
  if (rows === 1) style.flexWrap = 'nowrap';

  return (
    <div id={id} className="geniblocks gamete-pen" style={style}>
      { gameteViews }
    </div>
  );
};

GametePenView.propTypes = {
  id: PropTypes.string,
  sex: PropTypes.number.isRequired,
  gametes: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  gameteSize: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  columns: PropTypes.number,
  rows: PropTypes.number,
  tightenColumns: PropTypes.number,
  tightenRows: PropTypes.number,
  // SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default GametePenView;
