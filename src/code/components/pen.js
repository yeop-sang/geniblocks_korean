let OrganismView = require('./organism');

const PenView = ({orgs, width=400, columns=5}) => {
  let orgWidth = width/columns,
      orgViews = orgs.map((org, index) => (<OrganismView org={org} key={index} width={orgWidth}/>));

  return (
    <div className="geniblocks pen">
      { orgViews }
    </div>
  );
};

PenView.propTypes = {
  orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  width: React.PropTypes.number,
  columns: React.PropTypes.number
};

export default PenView;
