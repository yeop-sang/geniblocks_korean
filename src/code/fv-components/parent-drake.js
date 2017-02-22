import React, {PropTypes} from 'react';
import OrganismView from '../components/organism';
import classNames from 'classnames';

const ParentDrakeView = ({org, className}) => {
  let sexName = org.sex ? "FEMALE" : "MALE",
      drakeView = <OrganismView org={org} flipped={org.sex}/>,
      textView = <div className={"parentTitle"}> {sexName} </div>;

  return (
    <div className={classNames("geniblocks", "parentDrake", className)}>
        {org.sex ? textView : drakeView}
        {org.sex ? drakeView : textView}
    </div>
  );
};

ParentDrakeView.propTypes = {
  org: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ParentDrakeView;
