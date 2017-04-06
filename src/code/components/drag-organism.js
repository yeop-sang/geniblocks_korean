/*
 * React DnD DragSource wrapper for an OrganismView.
 * Supports rendering via HTML5 dragImage (useCustomDragLayer=false)
 * or custom drag layer (useCustomDragLayer=true).
 * Custom drag layer is required for IE11 and for touch devices
 * that don't support HTML5 drag/drop API.
 */
import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import OrganismView, { getDrakeImageUrl } from './organism';

export const DRAG_ITEM_TYPE_ORGANISM = 'organism';

const dragOrganismSource = {
  beginDrag(props) {
    // make all props available for now
    return props;
  }
};

// collecting function gathers properties passed to dragged component
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class DragOrganismView extends Component {

  static propTypes = {
    org: PropTypes.object,
    width: PropTypes.number,
    scale: PropTypes.number,
    useCustomDragLayer: PropTypes.bool,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  }

  componentDidMount() {
    // cf. https://github.com/react-dnd/react-dnd/blob/master/examples/02%20Drag%20Around/Custom%20Drag%20Layer/DraggableBox.js
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    const { useCustomDragLayer, connectDragPreview } = this.props;
    if (useCustomDragLayer) {
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true
      });
    }
  }

  updateDragImage() {
    const { org, width, scale, connectDragPreview } = this.props,
          size = width || 200,
          scaledSize = size * (scale || 1),
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          img = new Image();
    img.onload = () => {
      canvas.width = scaledSize;
      canvas.height = scaledSize;
      ctx.drawImage(img, 0, 0, scaledSize, scaledSize);
      connectDragPreview(canvas);
    };
    img.src = getDrakeImageUrl(org);
  }

  render() {
    const { connectDragSource, isDragging, useCustomDragLayer, ...otherProps } = this.props,
          dragStyle = { opacity: isDragging ? 0.5 : 1, cursor: 'move' };

    if (!useCustomDragLayer)
      this.updateDragImage();

    return connectDragSource(
      <div>
        <OrganismView style={dragStyle} {...otherProps} />
      </div>
    );
  }
}

export default DragSource(
                DRAG_ITEM_TYPE_ORGANISM,
                dragOrganismSource,
                collect)(DragOrganismView);
