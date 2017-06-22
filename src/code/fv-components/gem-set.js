import React, {PropTypes} from 'react';
import { getMissionGems, scoreValues } from '../reducers/helpers/challenge-progress';
import classNames from 'classnames';

export const GemView = ({challengeNum, gem, highlight, onNavigateToGem}) => {
  let gemDiv = (gem != null && gem !== scoreValues.NONE)
              ? highlight
                ? <div className="gem-outline-highlight" onClick={onNavigateToGem}>
                    <div className={"gem-fill gem-fill-" + gem}></div>
                  </div>
                : <div className="gem-outline-highlight" onClick={onNavigateToGem} style={{visibility: "hidden"}}>
                    <div className={"gem-fill gem-fill-" + gem} style={{visibility: "visible"}}></div>
                  </div>
              : <div className="gem-outline" onClick={onNavigateToGem}>
                  <div className="gem-number-text">
                    {challengeNum}
                  </div>
                </div>;
  return (
    <div className={ classNames("gem-container", {highlight: highlight}) }>
      {gemDiv}
    </div>
  );
};

GemView.propTypes = {
  challengeNum: PropTypes.number,
  gem: PropTypes.number,
  highlight: PropTypes.bool,
  onNavigateToGem: PropTypes.func
};

const GemSetView = ({level, mission, challenge, challengeCount, gems, onNavigateToChallenge}) => {

  let getAwardImage = (progressImages, gemNumber, challengeGem, highlight, onNavigateToGem) => {
    if (challengeGem != null && challengeGem !== scoreValues.NONE){
      return <GemView key={gemNumber} gem={challengeGem} highlight={highlight} onNavigateToGem={onNavigateToGem}/>;
    } else {
      return <GemView key={gemNumber} challengeNum={gemNumber} onNavigateToGem={onNavigateToGem}/>;
    }
  };

  let missionGems = getMissionGems(level, mission, challengeCount, gems),
      progressImages = [];

  for (let challengeNum = 0; challengeNum < challengeCount; challengeNum++) {
    let gemNumber = challengeNum + 1,
        highlight = challenge === challengeNum,
        challengeGem = missionGems[challengeNum],
        routeSpec = {level, mission, challenge: challengeNum};
    progressImages.push(getAwardImage(progressImages, gemNumber, challengeGem, highlight, 
                                      onNavigateToChallenge ? onNavigateToChallenge.bind(this, routeSpec) : null));
  }

  return (
    <div className="gem-set-container">
      <div className="gem-set">
        {progressImages}
      </div>
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
