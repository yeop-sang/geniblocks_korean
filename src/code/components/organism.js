import React, {PropTypes} from 'react';

export function getDrakeImageUrl(org) {
  const baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/";
  return org ? baseUrl + org.getImageName() : null;
}

const OrganismView = ({org, id, className="", width=200, flipped=false, style={}, onClick, wrapper }) => {
  const url = getDrakeImageUrl(org),
        // The goal here was to have the onMouseDown handler select the organism,
        // so that mousedown-drag will both select the organism and begin the
        // drag. This works on Chrome and Safari, but on Firefox it disables
        // dragging. Disabling the onMouseDown handler means that Firefox users
        // must click to select and then click to drag, but at least they can
        // drag. The right solution is probably to allow organisms to be dragged
        // whether or not they're selected and then hopefully the onMouseDown
        // handler will work as expected. Otherwise, it may be necessary to
        // select the organism (if it isn't already selected) in beginDrag.
        isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0),
        handleMouseDown = isFirefox ? undefined : handleClick,
        divWrapper = wrapper || function(elt) { return elt; };

  let classes = "geniblocks organism" + (className ? " " + className : "");
  if (flipped) {
    classes += " flipped";
  }
  if (onClick) {
    classes += " clickable";
  }

  function handleClick() {
    if (onClick) onClick(id, org);
  }

  return divWrapper(
    <div className={classes} id={id} style={style}
          onMouseDown={onClick ? handleMouseDown : null}
          onClick={onClick ? handleClick : null}>
      {url ? <img src={url} width={width} /> : null}
    </div>
  );
};

OrganismView.propTypes = {
  org: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  onClick: PropTypes.func,
  wrapper: PropTypes.func
};

export default OrganismView;
