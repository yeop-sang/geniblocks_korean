import OrganismGlowView from './organism-glow';
import QuestionGlowView from './question-glow';

const QuestionOrganismGlowView = ({hidden, color, size, ...other}) => {
  const orgView = <OrganismGlowView color={color} size={size} {...other} />,
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
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number
};

export default QuestionOrganismGlowView;
