/*
 * Example of using a React DnD custom drag layer for rendering
 * Custom drag layer is required for IE11 and for touch devices
 * that don't support HTML5 drag/drop API.
 *
 * The current state of React DnD backend support is somewhat muddled.
 * The default/only backend that is officially supported is the
 * HTML5Backend, which utilizes the HTML5 drag/drop API. Unfortunately,
 * the HTML5 drag/drop API is only partially supported on IE11 and
 * completely unsupported on most mobile browsers. To support IE11,
 * one must use a custom drag layer because IE11 doesn't support the
 * dragImage API. This module demonstrates how to use a custom drag
 * layer. Support of touch devices is trickier.
 *
 * The officially recommended way of supporting touch devices is to use the
 * third-party https://www.npmjs.com/package/react-dnd-touch-backend, which
 * utilizes touch events rather than drag/drop events. This seems to work
 * reasonably well on touch devices. This touch backend has a mode which
 * purports to support mouse events as well, but reading the Github issues
 * for the project suggests that the mouse support is reportedly buggy and
 * the ReadMe recommends against using its mouse event support. As a result,
 * the state of the art seems to be to dynamically choose between the
 * built-in HTML5Backend and the TouchBackend based on a run-time test
 * for whether one is running on a touch device or not. Unfortunately,
 * testing for touch devices isn't always straightforward, and the
 * profusion of devices which support both mouse and touch events
 * makes the notion of choosing between the two problematic. So the
 * result is that devices that support both mouse and touch may end
 * up working with the mouse but not touch (if the HTML5Backend is chosen)
 * or working with touch but behaving erratically with the mouse (if the
 * TouchBackend is chosen), and it's not always easy to predict which.
 *
 * There are a couple of other possibilities for enabling touch support.
 * https://www.npmjs.com/package/react-dnd-multi-backend purports to
 * support dynamically switching between the HTML5Backend and the
 * TouchBackend depending on the events received.
 * https://www.npmjs.com/package/react-dnd-html5-touch-backend purports to
 * fold touch events into the drag/drop-like events which are then tied
 * to the HTML5Backend analogously to the HTML5 drag/drop events.
 * https://github.com/Bernardo-Castilho/dragdroptouch is a library which
 * maps touch events to drag/drop events, which might be sufficient to
 * make the HTML5Backend work on touch devices.
 */
import React, { PropTypes } from 'react';
import { DragLayer } from 'react-dnd';
import { DRAG_ITEM_TYPE_ORGANISM } from './drag-organism';
import OrganismView from './organism';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  opacity: 0.5
};

function getItemStyles(props) {
  const { currentOffset, item } = props;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset,
        scale = item.scale,
        // not sure where this offset comes from
        xOffset = 34,
        // we must account for scale factor
        xScaled = x / scale - xOffset,
        yScaled = y / scale;
  const transform = `translate(${xScaled}px, ${yScaled}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

class CustomDragLayer extends React.Component {
  renderItem(type, item) {
    switch (type) {
    case DRAG_ITEM_TYPE_ORGANISM:
      return (
        <OrganismView {...item} />
      );
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}

CustomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  isDragging: PropTypes.bool.isRequired
};

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

export default DragLayer(collect)(CustomDragLayer);
