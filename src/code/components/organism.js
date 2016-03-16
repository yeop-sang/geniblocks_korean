const OrganismView = ({org, id, width=200, style={}, onClick }) => {
  const baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
        url     = baseUrl + org.getImageName();

  return (
    <div className="geniblocks organism" id={id} style={style} onMouseDown={onClick} onClick={onClick}>
      <img src={url} width={width} />
    </div>
  );
};

OrganismView.propTypes = {
  org: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
  index: React.PropTypes.number,
  width: React.PropTypes.number,
  style: React.PropTypes.object,
  onClick: React.PropTypes.func
};

export default OrganismView;
