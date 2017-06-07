import React, {PropTypes} from 'react';

const GemView = ({challengeNum, score, highlight}) => {
  let gem = score != null 
              ? highlight
                ? <div className="gem-outline-highlight">
                    <div className={"gem-fill-" + score}></div>
                  </div>
                : <div className={"gem-fill-" + score}></div>
              : <div className="gem-outline">
                  <div className="gem-number-text">
                    {challengeNum}
                  </div>
                </div>;
  return (
    <div className="gem-container">
      {gem}
    </div>
  );
};

GemView.propTypes = {
  challengeNum: PropTypes.number,
  score: PropTypes.number,
  highlight: PropTypes.bool
};

export default GemView;
