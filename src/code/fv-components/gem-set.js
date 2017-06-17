import React, {PropTypes} from 'react';
import { getMissionGems } from '../reducers/helpers/challenge-progress';
import classNames from 'classnames';

export const GemView = ({challengeNum, score, highlight, onNavigateToGem}) => {
  let gem = score != null 
              ? highlight
                ? <div className="gem-outline-highlight" onClick={onNavigateToGem}>
                    <div className={"gem-fill gem-fill-" + score}></div>
                  </div>
                : <div className={"gem-fill gem-fill-" + score} onClick={onNavigateToGem}></div>
              : <div className="gem-outline" onClick={onNavigateToGem}>
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
  highlight: PropTypes.bool,
  onNavigateToGem: PropTypes.func
};

const GemSetView = ({level, mission, challenge, challengeCount, gems, onNavigateToChallenge}) => {

  let getAwardImage = (progressImages, gemNumber, score, highlight, onNavigateToGem) => {
    if (score > -1){
      return <GemView key={gemNumber} score={score} highlight={highlight} onNavigateToGem={onNavigateToGem}/>;
    } else {
      return <GemView key={gemNumber} challengeNum={gemNumber} onNavigateToGem={onNavigateToGem}/>;
    }
  };

  let challengeScores = getMissionGems(level, mission, challengeCount, gems),
      progressImages = [];

  for (let challengeNum = 0; challengeNum < challengeCount; challengeNum++) {
    let gemNumber = challengeNum + 1,
        highlight = challenge === challengeNum,
        challengeScore = challengeScores[challengeNum],
        routeSpec = {level, mission, challenge: challengeNum};
    progressImages.push(getAwardImage(progressImages, gemNumber, challengeScore, highlight, 
                                      onNavigateToChallenge ? onNavigateToChallenge.bind(this, routeSpec) : null));
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
  gems: PropTypes.array.isRequired,
  onNavigateToChallenge: PropTypes.func
};

export default GemSetView;
