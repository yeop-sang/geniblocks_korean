import React, {PropTypes} from 'react';
import t from '../utilities/translate';
import GemSetView from './gem-set';
import VenturePadView from './venture-pad';

const NavigationDialogView = ({challengeAwards}) => {
  let gemSets = [];
  for (let level = 0; level < 17; level++) {
    gemSets.push(<div className="gem-set-label">{"Level " + level + ":"}</div>);
    gemSets.push(<GemSetView level={level} mission={0} challenge={0} challengeCount={1} progress={challengeAwards.progress} />);
  }

  let screen = (
    <div>
      {gemSets}
    </div>
  );

  return <VenturePadView title={t("~VENTURE.MAP")} screen={screen}/>;
};

NavigationDialogView.propTypes = {
  challengeAwards: PropTypes.object
};

export default NavigationDialogView;
