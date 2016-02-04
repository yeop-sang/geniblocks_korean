let OrganismView = require('./organism');

const PenView = ({orgs, width=400, columns=5}) => {
  let orgWidth = width/columns,
      orgViews = orgs.map((org) => (<OrganismView org={org} width={orgWidth}/>));

  return (
    <div className="geniblocks pen">
      { orgViews }
    </div>
  );
}

export default PenView;
