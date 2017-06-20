import React, {PropTypes} from 'react';
import t from '../utilities/translate';
import GemSetView, {GemView} from './gem-set';
import { getScoreValue } from '../reducers/helpers/challenge-progress';

const EndLevelDialogView = ({currentGem, challengeAwards, onNextChallenge, onTryAgain}) => {
  let getGemDisplayName = (score) => {
    let gemName = t("~VENTURE.AWARD_FIRST");
    if (score === 1) gemName = t("~VENTURE.AWARD_SECOND");
    if (score >= 2) gemName = t("~VENTURE.AWARD_THIRD");
    return gemName;
  };

  if (challengeAwards.routeSpec == null) {
    return null;
  }

  let level = challengeAwards.routeSpec.level,
      mission = challengeAwards.routeSpec.mission,
      challenge = challengeAwards.routeSpec.challenge,
      challengeCount = challengeAwards.challengeCount,
      progress = challengeAwards.progress,
      currentScore = getScoreValue(currentGem);

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
          <GemSetView level={level} mission={mission} challenge={challenge} challengeCount={challengeCount} progress={progress}/>
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
  currentGem: PropTypes.number,
  challengeAwards: PropTypes.object,
  onNextChallenge: PropTypes.func,
  onTryAgain: PropTypes.func
};

export default EndLevelDialogView;
