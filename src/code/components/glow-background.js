import CircularGlowView from './circular-glow';

const GlowBackgroundView = ({id, color, size, containerStyle={}, glowStyle={}, ChildComponent, childStyle={}, ...others}) => {
  const tContainerStyle = { position: 'relative', width: size, height: size, ...containerStyle },
        tGlowStyle = { position: 'absolute', ...glowStyle },
        tChildStyle = { position: 'absolute', ...childStyle };

  return (
    <div classNames="geniblocks glow-background" style={tContainerStyle}>
      <CircularGlowView id={id} color={color} size={size} style={tGlowStyle}/>
      <ChildComponent id={id} style={tChildStyle} width={size} {...others} />
    </div>
  );
};

GlowBackgroundView.propTypes = {
  id: React.PropTypes.string.isRequired,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  containerStyle: React.PropTypes.object,
  glowStyle: React.PropTypes.object,
  ChildComponent: React.PropTypes.func,
  childStyle: React.PropTypes.object
};

export default GlowBackgroundView;
