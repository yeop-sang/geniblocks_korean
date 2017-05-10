import React, {PropTypes} from 'react';
import classNames from 'classnames';

const InteractiveGamete = ({isEgg, isSelected, onClick, id}) => {
  function handleClick(evt) {
    onClick(evt, id);
  }

  let className = classNames("interactive-gamete", isEgg ? "egg" : "sperm", {selected: isSelected});

  return (
    <div id={id} className={className} onClick={handleClick}></div>
  );
};

InteractiveGamete.propTypes = {
  isEgg: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string,
};

export default InteractiveGamete;
