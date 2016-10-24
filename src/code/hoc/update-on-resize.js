import React from 'react';

/*
  Higher-order component (HOC) that uses the PropsProxy pattern
  (https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  to force an update of the WrappedComponent when a window resize occurs.

  This can be necessary, for instance, when using ReactMotion to animate React
  elements to locations specified by DOM elements, but those DOM elements may
  move when the window is resized without triggering a redraw because no props
  or state are changed on window resize events, but DOM elements can certainly move.
 */
export default function updateOnResize(WrappedComponent) {
  return class extends React.Component {

    handleResize = () => {
      this.forceUpdate();
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  };
}
