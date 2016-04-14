import {PropTypes} from 'react';
import OrganismView from './organism';

const PenView = ({orgs, idPrefix='organism-', width=400, columns=5, SelectedOrganismView=OrganismView, selectedIndex, handleClick}) => {

  function localHandleClick(id, org) {
    // That this conversion would be better done by the OrganismView
    // and then propagated up to here.
    const prefixIndex = id.indexOf(idPrefix),
          index = Number(id.substr(prefixIndex + idPrefix.length));
    if (handleClick) handleClick(index, id, org);
  }

  let orgWidth = width/columns,
      orgViews = orgs.map((org, index) => {
        return index === selectedIndex
                ? <SelectedOrganismView org={org} id={idPrefix + index} index={index} key={index}
                                    color="#FFFFAA" size={orgWidth} handleClick={localHandleClick}/>
                : <OrganismView org={org} id={idPrefix + index} index={index} key={index}
                                width={orgWidth} handleClick={localHandleClick}/>;
      });

  return (
    <div className="geniblocks pen">
      { orgViews }
    </div>
  );
};

PenView.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  width: PropTypes.number,
  columns: PropTypes.number,
  SelectedOrganismView: PropTypes.func,
  selectedIndex: PropTypes.number,
  handleClick: PropTypes.func
};

export default PenView;
