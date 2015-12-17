const OrganismView = ({org = null}) => {
  if (!org) {
    return (
      <div className="geniblocks organism">
        <span className="unknown-organism">?</span>
      </div>
    );
  }

  let baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url     = baseUrl+ org.getImageName();

  return (
    <div className="geniblocks organism">
      <img src={url} />
    </div>
  );
}

export default OrganismView;
