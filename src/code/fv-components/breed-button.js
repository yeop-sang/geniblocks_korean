import React, {PropTypes} from 'react';
import classNames from 'classnames';

const BreedButtonView = React.createClass({
  propTypes: {
    onBreed: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  },

  handleClick: function() {
    this.props.onBreed();
  },

  render: function() {
    return (
      <div className='geniblocks breed-button'>
        <div className={classNames('clickable-button', { 'disabled': this.props.disabled})} onClick={this.handleClick}>
          <div className="text unselectable">BREED</div>
        </div>
      </div>
    );
  }
});

BreedButtonView.propTypes = {
  onBreed: PropTypes.func.isRequired
};

export default BreedButtonView;