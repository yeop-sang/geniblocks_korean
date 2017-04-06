/*
 * React DnD DropTarget wrapper for FVStableView
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import FVStableView from './fv-stable';
import { DropTarget } from 'react-dnd';
import { DRAG_ITEM_TYPE_ORGANISM } from '../components/drag-organism';

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const stableTarget = {
  canDrop(/* props, monitor */) {
    // You can disallow drop based on props or item
    //const item = monitor.getItem();
    return true;
  },

  drop(props, monitor) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    //const item = monitor.getItem();

    // You can do something with it
    if (props.onDropDrake)
      props.onDropDrake();

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

class FVDropStableView extends React.Component {

  static propTypes = {
    isOver: PropTypes.bool,
    isOverCurrent: PropTypes.bool,
    canDrop: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    className: PropTypes.string
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }

    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }

    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  render() {
    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    const { className, isOver, canDrop, connectDropTarget, ...others } = this.props,
          classes = classNames(className, { 'drag-droppable': canDrop,
                                            'drag-over': canDrop && isOver });
    return connectDropTarget(
      <div>
        <FVStableView className={classes} {...others} />
      </div>
    );
  }
}

export default DropTarget(DRAG_ITEM_TYPE_ORGANISM, stableTarget, collect)(FVDropStableView);
