import React, {PropTypes} from 'react';
import { getMissionGems, scoreValues } from '../reducers/helpers/gems-helper';
import classNames from 'classnames';

export const GemView = ({challengeNum, gem, highlight, onNavigateToGem, isLocked}) => {
  let visibleStyle = {visibility: "visible"},
      highlightStyle = highlight && !isLocked ? visibleStyle : {visibility: "hidden"};

  onNavigateToGem = isLocked ? null : onNavigateToGem;
  let gemDiv = (gem != null && gem !== scoreValues.NONE)
              ? <div className="gem-outline-highlight" onClick={onNavigateToGem} style={highlightStyle}>
                  <div className={"gem-fill gem-fill-" + gem} style={visibleStyle}></div>
                </div>
              : <div className="gem-outline-highlight" onClick={onNavigateToGem} style={highlightStyle}>
                  <div className="gem-outline" onClick={onNavigateToGem} style={visibleStyle}>
                    <div className="gem-number-text">
                      {challengeNum}
                    </div>
                  </div>
                </div>;
  return (
    <div className={ classNames("gem-container", {highlight: highlight, locked: isLocked, navigable: onNavigateToGem}) }>
      {gemDiv}
    </div>
  );
};

GemView.propTypes = {
  challengeNum: PropTypes.number,
  gem: PropTypes.number,
  highlight: PropTypes.bool,
  onNavigateToGem: PropTypes.func,
  isLocked: PropTypes.bool
};

const GemSetView = ({level, mission, challenge, challengeCount, gems, onNavigateToChallenge, isLocked}) => {

  let getAwardImage = (progressImages, gemNumber, challengeGem, highlight, isLocked, onNavigateToGem) => {
    return <GemView key={gemNumber} challengeNum={gemNumber} gem={challengeGem} highlight={highlight} isLocked={isLocked} 
                    onNavigateToGem={onNavigateToGem}/>;
  };

  let missionGems = getMissionGems(level, mission, challengeCount, gems),
      progressImages = [];

  for (let challengeNum = 0; challengeNum < challengeCount; challengeNum++) {
    let gemNumber = challengeNum + 1,
        highlight = challenge === challengeNum,
        challengeGem = missionGems[challengeNum],
        routeSpec = {level, mission, challenge: challengeNum};
    progressImages.push(getAwardImage(progressImages, gemNumber, challengeGem, highlight, isLocked,
                                      onNavigateToChallenge ? onNavigateToChallenge.bind(this, routeSpec) : null));
  }

  return (
    <div className="gem-set-container">
      <div className={classNames("gem-set")}>
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
  onNavigateToChallenge: PropTypes.func,
  isLocked: PropTypes.bool
};

export default GemSetView;
