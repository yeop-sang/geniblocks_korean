import React, {PropTypes} from 'react';
import OrganismView from '../components/organism';

const StableDrakeView = ({org, id, width, height, style, onClick}) => {
  let orgStyle = { width, height };
  return (
    <div className="stable-drake-overlay" style={style}>
      <OrganismView org = {org} id = {id} width = {width} height = {height} style = {orgStyle} onClick = {onClick} />
    </div>
  );
};

StableDrakeView.propTypes = {
  org: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  onClick: PropTypes.func,
  wrapper: PropTypes.func,
};

export default StableDrakeView;
