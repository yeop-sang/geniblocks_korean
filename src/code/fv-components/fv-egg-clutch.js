import React, {PropTypes} from 'react';
import EggView from '../components/egg.js';

const FVEggClutchView = ({eggs, idPrefix='egg-', selectedIndex, onClick}) => {
  let orgViews = eggs.map((egg, index) => {
    const id = `${idPrefix}${index}`,
          visibilityStyle = egg && (egg.basket == null) ? {} : { visibility: 'hidden' },
          eggStyle = Object.assign({ }, visibilityStyle);
    return <EggView egg={egg} id={id} key={id} index={index} displayStyle={eggStyle}
                    isSelected={index === selectedIndex} onClick={onClick} />;
  });

  return (
    <div className="geniblocks egg-clutch">
      { orgViews }
      <div className="straw"></div>
    </div>
  );
};

FVEggClutchView.propTypes = {
  eggs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default FVEggClutchView;
