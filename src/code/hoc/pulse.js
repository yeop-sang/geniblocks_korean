import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default function pulse() {

  return function(WrappedComponent) {
    return React.createClass({

      propTypes: {
        pulse: PropTypes.bool,
        className: PropTypes.string
      },

      getInitialState() {
        return {clicked: false};
      },

      componentWillReceiveProps(nextProps) {
        if (!this.props.pulse && nextProps.pulse) {
          this.setState({clicked: false});
        }
      },

      handleClick() {
        this.setState({clicked: true});
      },
      
      render() {
        let className = classNames(this.props.className, {pulse: !this.state.clicked && this.props.pulse});
        return (
          <div onClick={this.handleClick} className={className}>
            <WrappedComponent {...this.props}/> 
          </div>
        );
      }

    });
  };
}
