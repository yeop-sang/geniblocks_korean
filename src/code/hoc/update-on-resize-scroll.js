import React from 'react';

/*
  Higher-order component (HOC) that uses the PropsProxy pattern
  (https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  to force an update of the WrappedComponent when a window resize or scroll event occurs.

  This can be necessary, for instance, when using ReactMotion to animate React
  elements to locations specified by DOM elements, but those DOM elements may
  move when the window is resized without triggering a redraw because no props
  or state are changed on window resize events, but DOM elements can certainly move.
 */
export default function updateOnResizeScroll(WrappedComponent) {
  return class extends React.Component {

    handleResizeOrScroll = () => {
      this.forceUpdate();
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResizeOrScroll);
      window.addEventListener('scroll', this.handleResizeOrScroll);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResizeOrScroll);
      window.removeEventListener('scroll', this.handleResizeOrScroll);
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  };
}
