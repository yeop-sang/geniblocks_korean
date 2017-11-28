import React, {PropTypes} from 'react';
import OrganismView from '../components/organism';
import classNames from 'classnames';

const ParentDrakeView = ({org, width=200, className}) => {
  let sexName = org.sex ? "FEMALE" : "MALE",
      drakeView = <OrganismView org={org} flipped={org.sex} width={width}/>,
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
  width: PropTypes.number,
  className: PropTypes.string
};

export default ParentDrakeView;
