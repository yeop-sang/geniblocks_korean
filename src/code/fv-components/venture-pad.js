import React, {PropTypes} from 'react';

const VenturePadView = ({title, screen, onClickOutside}) => {
  return (
    <div className="venture-pad-container">
      <div className="venture-pad-backdrop" onClick={onClickOutside}></div>
      <div className="venture-pad-background"></div>
      <div className="venture-pad-overlay"></div>
      <div className="venture-pad-screen">
        <div className="venture-pad-title">
          /{title}
        </div>
        <div className="venture-pad-flavor-text">
          {"Geni_retrieve <get> boot_all </get>"}
          <br/>
          {"Scale system flex/accessing drake genetics mainframe..."}
          <br/>
          {"/buffering data..."}
        </div>
        <div className="venture-pad-separator" id="venture-pad-separator-1"></div>
        { screen }
      </div>
    </div>
  );
};

VenturePadView.propTypes = {
  title: PropTypes.string,
  screen: PropTypes.object,
  onClickOutside: PropTypes.func
};

export default VenturePadView;
