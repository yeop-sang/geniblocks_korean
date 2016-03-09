/**
 * Stateless functional React component for displaying male/female change buttons
 * @param {string} sex - ['male' | 'female'] currently selected button
 * @param {function} onChange(evt, sex) - callback to be called when use clicks to change sex
 */
const ChangeSexButtons = ({sex, species, showLabel, style={}, onChange}) => {
  const capSex = sex.substr(0, 1).toUpperCase() + sex.substr(1),
        selectedSexClass = sex === 'male' ? "male-selected" : "female-selected",
        BUTTON_IMAGE_WIDTH = 100,
        BUTTON_IMAGE_MIDPOINT_X = BUTTON_IMAGE_WIDTH / 2,
        imageStyle = Object.assign(style, {position: 'absolute'}),
        label = showLabel ? `${capSex} ${species}` : '',
        labelElement = showLabel ? <div style={{position: 'absolute',
                                                fontSize: '14pt',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                left: BUTTON_IMAGE_WIDTH,
                                                whiteSpace: 'nowrap',
                                                marginLeft: 10}}>{label}</div> : '';

  function handleClick(evt) {
    const eltRect = evt.target.getBoundingClientRect(),
          clickX = evt.clientX - eltRect.left;
    if ((sex === 'male') !== (clickX > BUTTON_IMAGE_MIDPOINT_X))
      onChange(evt, sex === 'male' ? 'female' : 'male');
  }

  return (
    <div style={{position: 'relative'}}>
      <div  className={`geniblocks change-sex-buttons ${selectedSexClass}`}
            style={imageStyle} onClick={handleClick} >
      </div>
      {labelElement}
    </div>
  );
};

ChangeSexButtons.propTypes = {
  sex: React.PropTypes.oneOf(['male', 'female']).isRequired,
  species: React.PropTypes.string,
  showLabel: React.PropTypes.bool,
  style: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired
};

export default ChangeSexButtons;
