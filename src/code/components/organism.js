const OrganismView = ({org}) => {
  let baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url     = baseUrl+ org.getImageName();

  return (
    <div className="geniblocks organism">
      <img src={url} height="200px"/>
    </div>
  );
}

export default OrganismView;
