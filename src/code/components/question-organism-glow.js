import OrganismGlowView from './organism-glow';
import QuestionGlowView from './question-glow';

const QuestionOrganismGlowView = ({hidden, org, color, size, initialStyle={}, finalStyle={}, stiffness=60, onRest}) => {
  const orgView = <OrganismGlowView org={org} color={color} size={size}
                                    initialStyle={initialStyle} finalStyle={finalStyle}
                                    stiffness={stiffness} onRest={onRest} />,
        questionView = <QuestionGlowView glowColor={color} width={size} />,
        finalView = hidden ? questionView : orgView;

  return (
    <div classNames="geniblocks question-organism-glow">
      {finalView}
    </div>
  );
};

QuestionOrganismGlowView.propTypes = {
  hidden: React.PropTypes.bool,
  org: React.PropTypes.object,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  initialStyle: React.PropTypes.object,
  finalStyle: React.PropTypes.object,
  stiffness: React.PropTypes.number,
  onRest: React.PropTypes.func
};

export default QuestionOrganismGlowView;
