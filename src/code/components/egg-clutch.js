import React, {PropTypes} from 'react';
import EggView from './egg.js';

const EggClutchView = ({eggs, idPrefix='egg-', selectedIndex, onClick}) => {

  const ODD_EGG_MARGIN = 8,
        EVEN_EGG_MARGIN = 0;
  let orgViews;

  function eggViewForIndex(egg, index, margin) {
    const id = `${idPrefix}${index}`,
          visibilityStyle = egg && (egg.basket == null) ? {} : { visibility: 'hidden' },
          eggStyle = Object.assign({ marginLeft: margin, marginRight: margin }, visibilityStyle);
    return <EggView egg={egg} id={id} key={id} index={index} displayStyle={eggStyle}
                    isSelected={index === selectedIndex} onClick={onClick} />;
  }

  // even number of eggs
  if (eggs.length % 2 === 0) {
    orgViews = eggs.reduce((prev, egg, index) => {
      // for flex layout purposes, with odd numbers of items
      // we add spacer items between the eggs
      const spacerID = `${idPrefix}${index}-spacer`,
            spacerStyle = { marginLeft: EVEN_EGG_MARGIN, marginRight: EVEN_EGG_MARGIN,
                            visibility: 'hidden' },
            spacer = <EggView egg={null} key={spacerID} displayStyle={spacerStyle} />;
      if (index < eggs.length/2)
        prev.push(spacer);
      prev.push(eggViewForIndex(egg, index, EVEN_EGG_MARGIN));
      if (index >= eggs.length/2)
        prev.push(spacer);
      return prev;
    }, []);
    //orgViews = eggs.map((egg, index) => eggViewForIndex(egg, index, EVEN_EGG_MARGIN));
  }

  else {
    orgViews = eggs.reduce((prev, egg, index) => {
      prev.push(eggViewForIndex(egg, index, ODD_EGG_MARGIN));
      // for flex layout purposes, with odd numbers of items
      // we add spacer items between the eggs
      const spacerID = `${idPrefix}${index}-spacer`,
            spacerStyle = { marginLeft: ODD_EGG_MARGIN, marginRight: ODD_EGG_MARGIN,
                            visibility: 'hidden' };
      prev.push(<EggView egg={null} key={spacerID} displayStyle={spacerStyle} />);
      return prev;
    }, []);
  }

  return (
    <div className="geniblocks egg-clutch">
      { orgViews }
    </div>
  );
};

EggClutchView.propTypes = {
  eggs: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string,
  selectedIndex: PropTypes.number,
  onClick: PropTypes.func
};

export default EggClutchView;
