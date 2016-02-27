const OrganismView = ({org, width=200, initialStyle={}, finalStyle={}, onRest }) => {
  let baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url     = baseUrl+ org.getImageName(),
      initialOpacity = initialStyle && (initialStyle.opacity != null ? initialStyle.opacity : 1.0),
      finalOpacity = finalStyle && (finalStyle.opacity != null ? finalStyle.opacity : 1.0);

  /* eslint react/display-name:0 */
  return (
    <ReactMotion.Motion defaultStyle={{ opacity: initialOpacity }}
                        style={{ opacity: ReactMotion.spring(finalOpacity, { stiffness: 60 }) }}
                        onRest={onRest} >
      {
        interpolatedStyle => 
          <div className="geniblocks organism" style={interpolatedStyle}>
            <img src={url} width={width}/>
          </div>
      }
    </ReactMotion.Motion>
  );
};

OrganismView.propTypes = {
  org: React.PropTypes.object.isRequired,
  width: React.PropTypes.number,
  initialStyle: React.PropTypes.object,
  finalStyle: React.PropTypes.object,
  onRest: React.PropTypes.func
};

export default OrganismView;
