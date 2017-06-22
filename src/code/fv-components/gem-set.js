import React, {PropTypes} from 'react';
import { getMissionGems, scoreValues } from '../reducers/helpers/challenge-progress';
import classNames from 'classnames';

export const GemView = ({challengeNum, gem, highlight, onNavigateToGem}) => {
  let visibleStyle = {visibility: "visible"},
      highlightStyle = highlight ? visibleStyle : {visibility: "hidden"};
  let gemDiv = (gem != null && gem !== scoreValues.NONE)
              ? <div className="gem-outline-highlight" onClick={onNavigateToGem} style={highlightStyle}>
                  <div className={"gem-fill gem-fill-" + gem} style={visibleStyle}></div>
                </div>
              : <div className="gem-outline-highlight" onClick={onNavigateToGem} style={highlightStyle}>
                  <div className="gem-outline" onClick={onNavigateToGem} style={visibleStyle}>
                    <div className="gem-number-text">
                      {challengeNum}
                    </div>
                  </div>;
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
    return <GemView key={gemNumber} challengeNum={gemNumber} gem={challengeGem} highlight={highlight} onNavigateToGem={onNavigateToGem}/>;
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
