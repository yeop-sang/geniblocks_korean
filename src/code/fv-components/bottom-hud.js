import React, {PropTypes} from 'react';
import AvatarButtonView from './avatar-button';
import LevelIndicatorView from './level-indicator';
import CountView from './counter';
import GemSetView from './gem-set';
import t from '../utilities/translate';

const BottomHUDView = React.createClass({

  propTypes: {
    routeSpec: PropTypes.object,
    trial: PropTypes.number,
    trialCount: PropTypes.number,
    currScore: PropTypes.number,
    maxScore: PropTypes.number,
    currMoves: PropTypes.number,
    goalMoves: PropTypes.number,
    gems: PropTypes.array,
    numChallenges: PropTypes.number,
    showAward: PropTypes.bool,
    showChallengeWidgets: PropTypes.bool,
    tutorials: PropTypes.array
  },

  render() {
    let {routeSpec, trial, trialCount, currScore, maxScore, currMoves, goalMoves, numChallenges, gems, tutorials, onShowTutorial} = this.props,
        scoreView = maxScore ? <CountView countTitleText={t('~COUNTER.SCORE_LABEL')} className={'score-count'} currCount={currScore} maxCount={maxScore} /> : null,
        movesView = goalMoves > -1 ? <CountView countTitleText={t('~COUNTER.MOVES_LABEL')} className={'moves-count'} currCount={currMoves} maxCount={goalMoves} /> : null,
        showRouteWidgets = routeSpec !== null,
        routeWidgets, challengeWidgets, tutorialWidgets;

    if (showRouteWidgets) {
      let missionScreen = (
        <div className="mission-screen">
          <div className="mission-label mission-label-text">Mission</div>
          <div className="mission-label mission-label-value">{routeSpec.mission + 1}</div>
        </div>
      );

      routeWidgets = (
        <div>
          <LevelIndicatorView level={routeSpec.level + 1} />
          {missionScreen}
          <GemSetView level={routeSpec.level} mission={routeSpec.mission} challenge={routeSpec.challenge} challengeCount={numChallenges} gems={gems}/>
        </div>
      );
    }

    if (this.props.showChallengeWidgets) {
      challengeWidgets = (
        <div>
          <CountView countTitleText={t('~COUNTER.TRIAL_LABEL')} className={'trial-count'} currCount={trial} maxCount={trialCount} />
          {scoreView}
          {movesView}
        </div>
      );
    }
    if (tutorials && tutorials.length > 0) {
      // Also need to hide this until we are in the challenge, should not be visible on the main room view
      tutorialWidgets = (
        <div className="tutorial-activate">
          <div className="tutorial-icon" onClick={onShowTutorial} />
        </div>
      );
    }

    return (
      <div id='fv-bottom-hud' className='fv-hud fv-bottom-hud' >
        <AvatarButtonView />
        { routeWidgets }
        {challengeWidgets}
        {tutorialWidgets}
      </div>
    );
  }
});

export default BottomHUDView;
