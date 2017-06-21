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
    showAward: PropTypes.bool
  },

  render() {
    let {routeSpec, trial, trialCount, currScore, maxScore, currMoves, goalMoves, numChallenges, gems} = this.props,
        scoreView = maxScore ? <CountView countTitleText={t('~COUNTER.SCORE_LABEL')} className={'score-count'} currCount={currScore} maxCount={maxScore} /> : null,
        movesView = goalMoves > 0 ? <CountView countTitleText={t('~COUNTER.MOVES_LABEL')} className={'moves-count'} currCount={currMoves} maxCount={goalMoves} /> : null;

    return (
      <div id='fv-bottom-hud' className='fv-hud fv-bottom-hud' >
        <AvatarButtonView />
        <LevelIndicatorView level={routeSpec.level + 1} />
        <GemSetView level={routeSpec.level} mission={routeSpec.mission} challenge={routeSpec.challenge} challengeCount={numChallenges} gems={gems}/>
        <CountView countTitleText={t('~COUNTER.TRIAL_LABEL')} className={'trial-count'} currCount={trial} maxCount={trialCount} />
        {scoreView}
        {movesView}
      </div>
    );
  }
});

export default BottomHUDView;
