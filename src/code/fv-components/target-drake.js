import React, {PropTypes} from 'react';
import OrganismView from '../components/organism';

const TargetDrakeView = ({org}) => {

  return (
    <div className='geniblocks target-drake-container'>
      <div className="target-drake-text">Target Drake</div>
      <OrganismView org={org} width={170}/>
    </div>
  );
};

TargetDrakeView.propTypes = {
  org: PropTypes.object.isRequired
};

export default TargetDrakeView;
