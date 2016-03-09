const OrganismView = ({org, width=200, initialStyle={}, finalStyle={}, stiffness=60, onRest }) => {
  let baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url     = baseUrl + org.getImageName(),
      {position:iPosition, ...initialMotion} = initialStyle,
      {position:fPosition, ...finalMotion} = finalStyle,
      position = fPosition || iPosition,
      initial = Object.assign({ opacity: 1.0 }, initialMotion),
      final = Object.assign({ opacity: 1.0 }, finalMotion);

  if (final.opacity !== initial.opacity)
    final.opacity = ReactMotion.spring(final.opacity, { stiffness: stiffness });

  return (
    <ReactMotion.Motion defaultStyle={initial} style={final} onRest={onRest} >
      {
        interpolatedStyle => {
          const style = Object.assign(interpolatedStyle, position ? {position} : {});
          return (
            <div className="geniblocks organism" style={style}>
              <img src={url} width={width}/>
            </div>
          );
        }
      }
    </ReactMotion.Motion>
  );
};

OrganismView.propTypes = {
  org: React.PropTypes.object.isRequired,
  width: React.PropTypes.number,
  initialStyle: React.PropTypes.object,
  finalStyle: React.PropTypes.object,
  stiffness: React.PropTypes.number,
  onRest: React.PropTypes.func
};

export default OrganismView;
