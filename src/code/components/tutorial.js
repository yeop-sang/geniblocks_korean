import React, {PropTypes} from 'react';

const TutorialView = ({ hidden, ...other }) => {
  let tutorialClass = hidden ? "" : "active";
  return (
    <div id='tutorial' className={tutorialClass}>
      {hidden === false && <div>test</div>}
    </div>
  );
};

TutorialView.propTypes = {
  hidden: PropTypes.bool
};

export default TutorialView;
