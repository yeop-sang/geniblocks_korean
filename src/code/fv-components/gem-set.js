import React, {PropTypes} from 'react';
import { getChallengeScores } from '../reducers/helpers/challenge-progress';
import classNames from 'classnames';

export const GemView = ({challengeNum, score, highlight}) => {
  let gem = score != null
              ? highlight
                ? <div className="gem-outline-highlight">
                    <div className={"gem-fill gem-fill-" + score}></div>
                  </div>
                : <div className={"gem-fill gem-fill-" + score}></div>
              : <div className="gem-outline">
                  <div className="gem-number-text">
                    {challengeNum}
                  </div>
                </div>;
  return (
    <div className={ classNames("gem-container", {highlight: highlight}) }>
      {gem}
    </div>
  );
};

GemView.propTypes = {
  challengeNum: PropTypes.number,
  score: PropTypes.number,
  highlight: PropTypes.bool
};

const GemSetView = ({level, mission, challenge, challengeCount, gems}) => {

  let getAwardImage = (progressImages, gemNumber, score, currChallenge) => {
    if (score > -1){
      return <GemView key={gemNumber} score={score} highlight={currChallenge + 1 === gemNumber}/>;
    } else {
      return <GemView key={gemNumber} challengeNum={gemNumber}/>;
    }
  };

  let challengeScores = getChallengeScores(level, mission, challengeCount, gems),
      progressImages = [];

  for (let challengeNum = 0; challengeNum < challengeCount; challengeNum++) {
    let gemNumber = challengeNum + 1;
    progressImages.push(getAwardImage(progressImages, gemNumber, challengeScores[challengeNum], challenge));
  }

  return (
    <div className="gem-set">
      {progressImages}
    </div>
  );
};

GemSetView.propTypes = {
  level: PropTypes.number.isRequired,
  mission: PropTypes.number.isRequired,
  challenge: PropTypes.number,
  challengeCount: PropTypes.number.isRequired,
  gems: PropTypes.array.isRequired
};

export default GemSetView;
