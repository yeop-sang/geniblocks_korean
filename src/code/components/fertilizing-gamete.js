import AnimatedGameteView from './animated-gamete';

const INITIAL_GAMETE_SIZE = 30,
      FINAL_GAMETE_SIZE = 140,
      RESTING_MOTHER_GAMETE_X = 0,
      RESTING_FATHER_GAMETE_X = 150,
      FERTILIZING_MOTHER_GAMETE_X = 70,
      FERTILIZING_FATHER_GAMETE_X = 80,
      FINAL_ZYGOTE_Y = -150;

export const GAMETE_TYPE = { MOTHER: 'mother', FATHER: 'father' };

export default class FertilizingGameteView extends React.Component {

  static propTypes = {
    type: React.PropTypes.oneOf([ GAMETE_TYPE.MOTHER, GAMETE_TYPE.FATHER ]).isRequired,
    gamete: React.PropTypes.object.isRequired,
    id: React.PropTypes.number.isRequired,
    fertilizationState: React.PropTypes.oneOf(['none', 'fertilizing', 'fertilized', 'complete']).isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
    srcRect: React.PropTypes.shape({
      left: React.PropTypes.number.isRequired,
      top: React.PropTypes.number.isRequired,
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired
    }),
    dstRect: React.PropTypes.shape({
      left: React.PropTypes.number.isRequired,
      top: React.PropTypes.number.isRequired,
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired
    }),
    animStiffness: React.PropTypes.number,  // stiffness of spring for animation (default: 100)
    onRest: React.PropTypes.func
  }

  static defaultProps = {
    hiddenAlleles: [],
    animStiffness: 100
  }

  constructor(props) {
    super(props);
  }

  render = () => {
    let {gamete, id, hiddenAlleles, animStiffness, onRest} = this.props,
        xOffset = this.props.srcRect ? this.props.srcRect.left - this.props.dstRect.left : 0,
        yOffset = this.props.srcRect ? this.props.srcRect.top - this.props.dstRect.top : 0,
        xResting = this.props.type === GAMETE_TYPE.FATHER ? RESTING_FATHER_GAMETE_X
                                                          : RESTING_MOTHER_GAMETE_X,
        xFertilizing = this.props.type === GAMETE_TYPE.FATHER ? FERTILIZING_FATHER_GAMETE_X
                                                              : FERTILIZING_MOTHER_GAMETE_X,
        initial, final;

    if (!gamete || !id) return;

    if (this.props.fertilizationState === 'none') {
      if (this.props.type === GAMETE_TYPE.FATHER)
        xOffset += RESTING_FATHER_GAMETE_X;
      initial = { x: xOffset, y: yOffset, size: INITIAL_GAMETE_SIZE };
      final = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE };
    }
    else if (this.props.fertilizationState === 'fertilizing') {
      initial = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE, opacity: 1.0 };
      final = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
    }
    else {
      initial = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
      final = { x: xFertilizing, y: FINAL_ZYGOTE_Y, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 0.0 };
    }

    return (
      <AnimatedGameteView gamete={gamete} id={id} hiddenAlleles={hiddenAlleles}
                          initialDisplay={initial} display={final}
                          animStiffness={animStiffness} onRest={onRest} />
    );
  }
}
