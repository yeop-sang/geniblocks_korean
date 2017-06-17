import React, {PropTypes} from 'react';
import t from '../utilities/translate';
import GemSetView from './gem-set';
import VenturePadView from './venture-pad';

const NavigationDialogView = ({gems, onNavigateToChallenge}) => {
  let gemSets = [];
  for (let level = 0; level < 17; level++) {
    gemSets.push(<div className="gem-set-label">{"Level " + level + ":"}</div>);
    gemSets.push(<GemSetView level={level} mission={0} challenge={0} challengeCount={1} gems={gems} 
                             onNavigateToChallenge={onNavigateToChallenge} />);
  }

  let screen = (
    <div className="navigation-dialog">
      {gemSets}
    </div>
  );

  return <VenturePadView title={t("~VENTURE.MAP")} screen={screen}/>;
};

NavigationDialogView.propTypes = {
  gems: PropTypes.array,
  onNavigateToChallenge: PropTypes.func
};

export default NavigationDialogView;
