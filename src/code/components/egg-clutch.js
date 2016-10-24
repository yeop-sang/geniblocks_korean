import React, {PropTypes} from 'react';

// image specified as CSS background-image, but size constants required in JavaScript
export const  EGG_IMAGE_WIDTH = 75,
              EGG_IMAGE_HEIGHT = 109;

export class EggView extends React.Component {

  static propTypes = {
    egg: PropTypes.object,
    id: PropTypes.string,
    index: PropTypes.number,
    isSelected: PropTypes.bool,
    displayStyle: PropTypes.object,
    onClick: PropTypes.func
  };

  handleClick = (evt) => {
    const { egg, id, index, onClick } = this.props;
    if (onClick)
      onClick(id, index, egg);
    evt.stopPropagation();
  }

  render() {
    const { egg, id, displayStyle, isSelected } = this.props,
          eggStyle = Object.assign({ flexShrink: 0 }, displayStyle),
          isHidden = (egg == null),
          classes = 'clutch-egg' + (isSelected ? ' selected' : '')
                                 + (isHidden ? ' hidden' : '');
    if (displayStyle && (displayStyle.size != null)) {
      eggStyle.width = displayStyle.size;
      eggStyle.height = eggStyle.width * (EGG_IMAGE_HEIGHT / EGG_IMAGE_WIDTH);
    }
    return (
      <div id={id} className={classes} key={id} ref='domNode' style={eggStyle} onClick={this.handleClick} />
    );
  }
}

const EggClutchView = ({eggs, idPrefix='egg-', selectedIndex, onClick}) => {

  const ODD_EGG_MARGIN = 8,
        EVEN_EGG_MARGIN = 35;
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
    orgViews = eggs.map((egg, index) => eggViewForIndex(egg, index, EVEN_EGG_MARGIN));
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
