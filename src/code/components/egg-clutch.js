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
    onUpdateBounds: PropTypes.func,
    onClick: PropTypes.func
  };

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { egg, index, onUpdateBounds } = this.props,
          { domNode } = this.refs;
    if (domNode && onUpdateBounds)
      onUpdateBounds(egg, index, domNode.getBoundingClientRect());
  }

  handleClick = (evt) => {
    const { egg, id, index, onClick } = this.props;
    if (onClick)
      onClick(id, index, egg);
    evt.stopPropagation();
  }

  render() {
    const { egg, id, displayStyle, isSelected } = this.props,
          eggStyle = { flexShrink: 0 },
          isHidden = (egg == null),
          classes = 'clutch-egg' + (isSelected ? ' selected' : '')
                                 + (isHidden ? ' hidden' : '');
    if (displayStyle && (displayStyle.position != null))
      eggStyle.position = displayStyle.position;
    if (displayStyle && (displayStyle.size != null)) {
      eggStyle.width = displayStyle.size;
      eggStyle.height = eggStyle.width * (EGG_IMAGE_HEIGHT / EGG_IMAGE_WIDTH);
    }
    if (displayStyle && (displayStyle.opacity != null))
      eggStyle.opacity = displayStyle.opacity;
    return (
      <div className={classes} key={id} ref='domNode' style={eggStyle} onClick={this.handleClick} />
    );
  }
}

const EggClutchView = ({eggs, idPrefix='egg-', selectedIndex, onUpdateBounds, onClick}) => {

  let orgViews = eggs.map((egg, index) => {
        const id = `${idPrefix}${index}`,
              eggStyle = egg && (egg.basket == null) ? {} : { visibility: 'hidden' };
        return <EggView egg={egg} id={id} key={id} index={index}
                        isSelected={index === selectedIndex} displayStyle={eggStyle}
                        onUpdateBounds={onUpdateBounds} onClick={onClick} />;
      });

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
  onUpdateBounds: PropTypes.func,
  onClick: PropTypes.func
};

export default EggClutchView;
