import OrganismView from './organism';

const PenView = ({orgs, idPrefix='organism-', width=400, columns=5, SelectedOrganismView=OrganismView, selectedIndex, onClick}) => {

  function handleClick(evt) {
    const index = Number(evt.currentTarget.id.substr(idPrefix.length));
    if (onClick)
      onClick(evt, index);
  }

  let orgWidth = width/columns,
      orgViews = orgs.map((org, index) => {
        return index === selectedIndex
                ? <SelectedOrganismView org={org} id={idPrefix + index} index={index} key={index}
                                    color="#FFFFAA" size={orgWidth} onClick={handleClick}/>
                : <OrganismView org={org} id={idPrefix + index} index={index} key={index}
                                width={orgWidth} onClick={handleClick}/>;
      });

  return (
    <div className="geniblocks pen">
      { orgViews }
    </div>
  );
};

PenView.propTypes = {
  orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  idPrefix: React.PropTypes.string,
  width: React.PropTypes.number,
  columns: React.PropTypes.number,
  SelectedOrganismView: React.PropTypes.func,
  selectedIndex: React.PropTypes.number,
  onClick: React.PropTypes.func
};

export default PenView;
