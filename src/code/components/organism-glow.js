import CircularGlowView from './circular-glow';
import OrganismView from './organism';

const OrganismGlowView = ({org, color, size, initialStyle={}, finalStyle={}, stiffness=60, onRest}) => {
  const containerStyle = {position: 'relative', width: size, height: size},
        glowStyle = {position: 'absolute'},
        initialOrgStyle = Object.assign(initialStyle, {position: 'absolute'}),
        finalOrgStyle = Object.assign(finalStyle, {position: 'absolute'});

  return (
    <div classNames="geniblocks organism-glow" style={containerStyle}>
      <CircularGlowView color={color} size={size} style={glowStyle}/>
      <OrganismView org={org} color={color} width={size}
                    initialStyle={initialOrgStyle} finalStyle={finalOrgStyle}
                    stiffness={stiffness} onRest={onRest} />
    </div>
  );
};

OrganismGlowView.propTypes = {
  org: React.PropTypes.object,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  initialStyle: React.PropTypes.object,
  finalStyle: React.PropTypes.object,
  stiffness: React.PropTypes.number,
  onRest: React.PropTypes.func
};

export default OrganismGlowView;
