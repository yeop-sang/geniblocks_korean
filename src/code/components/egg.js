import React, {PropTypes} from 'react';

// image specified as CSS background-image, but size constants required in JavaScript
export const  EGG_IMAGE_WIDTH = 213,
              EGG_IMAGE_HEIGHT = 256;

class EggView extends React.Component {

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

export default EggView;