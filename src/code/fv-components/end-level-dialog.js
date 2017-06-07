import React, {PropTypes} from 'react';
import t from '../utilities/translate';
import GemView from './gem';

const EndLevelDialogView = ({challengeAwards, onNextChallenge, onTryAgain}) => {
  let addAwardImage = (progressImages, pieces, pieceNum, score, currChallenge) => {
    if (score > -1){
      progressImages.push(<GemView score={score} highlight={currChallenge + 1 === pieceNum}/>);
    } else {
      progressImages.push(<GemView challengeNum={pieceNum}/>);
    }
    return progressImages;
  };

  let getGemDisplayName = (score) => {
    let gemName = t("~VENTURE.AWARD_FIRST");
    if (score === 1) gemName = t("~VENTURE.AWARD_SECOND");
    if (score >= 2) gemName = t("~VENTURE.AWARD_THIRD");
    return gemName;
  };


  let level = 0, mission = 0, challenge = 0, challengeCount = 0, progress = [], progressImages = [];

  if (challengeAwards.routeSpec != null) {
    level = challengeAwards.routeSpec.level,
    mission = challengeAwards.routeSpec.mission,
    challenge = challengeAwards.routeSpec.challenge,
    challengeCount = challengeAwards.challengeCount;
    progress = challengeAwards.progress;
  } else return null;

  let pieceKey = level + ":" + mission + ":";
  let challengeScore = {};

  // Get the score for each challenge by summing over trials
  for (let i = 0; i < challengeCount; i++){
    for (var key in progress){
      if (key.startsWith(pieceKey + i)){
        const score = progress[key];
        if (challengeScore[i] == null) {
           challengeScore[i] = score;
        } else {
          challengeScore[i] += score;
        }
      }
    }
  }
  let pieceNum = challenge + 1;

  for (let challengeNum = 0; challengeNum < challengeCount; challengeNum++) {
    pieceNum = parseInt(challengeNum) + 1;
    progressImages = addAwardImage(progressImages, challengeCount, pieceNum, challengeScore[challengeNum], challenge);
  }

  let currentScore = challengeScore[challenge];
  return (
    <div className="end-level-dialog-container">
      <div className="end-level-dialog-backdrop"></div>
      <div className="end-level-dialog-background"></div>
      <div className="end-level-dialog-overlay"></div>
      <div className="end-level-dialog-screen">
        <div className="challenge-complete-text">
          /{t("~VENTURE.END_LEVEL")}
        </div>
        <div className="end-level-flavor-text">
          {"Geni_retrieve <get> boot_all </get>"}
          <br/>
          {"Scale system flex/accessing drake genetics mainframe..."}
          <br/>
          {"/buffering data..."}
        </div>
        <div className="end-level-separator" id="end-level-separator-1"></div>
        <div className="you-earned-text">
          {t("~VENTURE.YOU_EARNED")}:
        </div>
        <div className="gem-info">
          <div className="gem-win-box">
            <GemView score={currentScore}/>
            <div className="gem-won-text">
              {getGemDisplayName(currentScore)}
            </div>
          </div>
          <div className="gem-history">
            {progressImages}
          </div>
        </div>
        <div className="end-level-separator" id="end-level-separator-2"></div>
        <div className="end-level-navigation-buttons">
          <div className="try-again-button-container">
            <div className="try-again-button" onClick={onTryAgain}></div>
            <div className="try-again-text">
              {t("~BUTTON.TRY_AGAIN")}
            </div>
          </div>
          <div className="continue-button-container">
            {t("~BUTTON.CONTINUE")}
            <div className="continue-button" onClick={onNextChallenge}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

EndLevelDialogView.propTypes = {
  challengeAwards: PropTypes.object,
  onNextChallenge: PropTypes.func,
  onTryAgain: PropTypes.func
};

export default EndLevelDialogView;
