/**
 * Stateless functional React component for displaying a Biologica gamete that animates
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} [initialDisplay] - initial display parameters used to represent the gamete
 * @param {number} [initialDisplay.x] - initial location (left) of the gamete
 * @param {number} [initialDisplay.y] - initial location (top) of the gamete
 * @param {number} [initialDisplay.size=30] - initial size (width & height) of the gamete
 * @param {number} [initialDisplay.rotation=0] - initial rotation of the gamete
 * @param {number} [initialDisplay.opacity=1] - initial opacity of the gamete
 * @param {Object} display - final display parameters used to represent the gamete
 * @param {number} display.x - final location (left) of the gamete
 * @param {number} display.y - final location (top) of the gamete
 * @param {number} [display.size=30] - final size (width & height) of the gamete
 * @param {number} [display.rotation=0] - final rotation of the gamete
 * @param {number} [display.opacity=1] - final opacity of the gamete
 * @param {number} [animStiffness=100] - spring stiffness used to control animation speed
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 * @param {function} [onRect()] - callback function to be called when the animation is at rest
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
const GameteView = require('./gamete');

const AnimatedGameteView = ({gamete, id, hiddenAlleles=[], initialDisplay, display, animStiffness=100, isSelected=false, isDisabled=false, onClick, onRest}) => {

  const group = id % 4,
        rotationForGroup = group * 90,
        initial = initialDisplay || display,
        initialSize = initial.size || 30,
        initialRotation = initial.rotation != null ? initial.rotation : rotationForGroup,
        initialOpacity = initial.opacity != null ? initial.opacity : 1.0,
        finalSize = display.size || 30,
        finalRotation = display.rotation != null ? display.rotation : rotationForGroup,
        finalOpacity = display.opacity != null ? display.opacity : 1.0,
        springConfig = { stiffness: animStiffness };
  /* eslint react/display-name:0 */
  return (
    <ReactMotion.Motion defaultStyle={{
                          x: initial.x, y: initial.y, size: initialSize,
                          rotation: initialRotation, opacity: initialOpacity
                        }}
                        style={{
                          x: ReactMotion.spring(display.x, springConfig),
                          y: ReactMotion.spring(display.y, springConfig),
                          size: ReactMotion.spring(finalSize, springConfig),
                          rotation: ReactMotion.spring(finalRotation, springConfig),
                          opacity: ReactMotion.spring(finalOpacity, springConfig)
                        }}
                        onRest={onRest} >
      {
        interpolatedStyle =>
          <GameteView gamete={gamete} id={id} hiddenAlleles={hiddenAlleles} 
                      display={interpolatedStyle}
                      isSelected={isSelected} isDisabled={isDisabled} onClick={onClick} />
      }
    </ReactMotion.Motion>
  );
};

AnimatedGameteView.propTypes = {
  gamete: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  initialDisplay: React.PropTypes.shape({ // initial display properties
    x: React.PropTypes.number.isRequired, // location (left) of gamete image
    y: React.PropTypes.number.isRequired, // location (top) of gamete image
    size: React.PropTypes.number,         // size of gamete image (default: 30)
    rotation: React.PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: React.PropTypes.number       // opacity of gamete image (default: 1.0)
  }),
  display: React.PropTypes.shape({        // final display properties
    x: React.PropTypes.number.isRequired, // location (left) of gamete image
    y: React.PropTypes.number.isRequired, // location (top) of gamete image
    size: React.PropTypes.number,         // size of gamete image (default: 30)
    rotation: React.PropTypes.number,     // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: React.PropTypes.number       // opacity of gamete image (default: 1.0)
  }).isRequired,
  animStiffness: React.PropTypes.number,  // stiffness of spring for animation (default: 100)
  isSelected: React.PropTypes.bool,
  isDisabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onRest: React.PropTypes.func
};

export default AnimatedGameteView;
