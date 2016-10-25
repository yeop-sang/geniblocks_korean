import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

/*
  Higher-order component (HOC) that uses the PropsProxy pattern
  (https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  to wrap the provided WrappedComponent to simplify animation using ReactMotion.

  This HOC provides the following to the WrappedComponent:
  - wraps it in a <div> with class "animated-component-container"
  - applies the provided/default spring properties to all properties of the targetStyle
  - combines the initialStyle into the targetStyle so that unchanged properties
    don't have to be specified in the targetStyle
  - sets an 'isComplete' instance variable to true when the motion first completes
  - once the motion is complete, subsequent renders simply render the WrappedComponent
    in its target state without further animation. This allows animations at rest to
    respond immediately to window resize events, for instance.
 */
export default function animateSpring(stiffness=120, damping=25) {

  return function(WrappedComponent) {
    return class extends React.Component {
      
      static propTypes = {
        key: PropTypes.string,
        initialStyle: PropTypes.object.isRequired,
        targetStyle: PropTypes.object.isRequired,
        onRest: PropTypes.func
      }

      handleRest = (...args) => {
        if (this.props.onRest)
          this.props.onRest(...args);

        this.isComplete = true;
      }

      render() {
        const springConfig = { stiffness, damping },
              { key, initialStyle, targetStyle, ...otherProps } = this.props,
              // combine the styles with target properties overriding initial properties
              staticStyle = {...initialStyle, ...targetStyle};
        let style = {}, prop;
        // apply spring to every property in the targetStyle
        for (prop in targetStyle) {
          style[prop] = spring(targetStyle[prop], springConfig);
        }
        return (
          this.isComplete
            ? <div key={`static-${key}`} className="animated-component-container" style={staticStyle}>
                <WrappedComponent style={staticStyle} {...otherProps}/>
              </div>
            : <Motion key={`motion-${key}`} defaultStyle={initialStyle} style={style} onRest={this.handleRest}>
                {
                  interpolatedStyle => {
                    const combinedStyle = {...initialStyle, ...interpolatedStyle};
                    return (
                      <div className="animated-component-container" style={interpolatedStyle}>
                        <WrappedComponent style={combinedStyle} {...otherProps}/>
                      </div>
                    );
                  }
                }
              </Motion>
        );
      }
    };
  };
}
