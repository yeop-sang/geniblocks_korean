import CircularGlowView from './circular-glow';
import OrganismView from './organism';

/**
 * Represents a BioLogica organism as an image on top of a circular gradient "glow" background.
 * Implemented as a React stateless functional component.
 *
 * @param {BioLogica.Organism} org - the organism to be represented
 * @param {string} color - the color of the circular gradient "glow" background view.
 * @param {number} size
 */
const OrganismGlowView = ({id, color, size, style={}, ...other}) => {
  const containerStyle = {position: 'relative', width: size, height: size},
        glowStyle = { position: 'absolute' },
        orgStyle = { position: 'absolute', ...style };

  return (
    <div classNames="geniblocks organism-glow" style={containerStyle}>
      <CircularGlowView id={id} color={color} size={size} style={glowStyle}/>
      <OrganismView id={id} width={size} style={orgStyle} {...other} />
    </div>
  );
};

OrganismGlowView.propTypes = {
  id: React.PropTypes.string,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  style: React.PropTypes.object
};

export default OrganismGlowView;
