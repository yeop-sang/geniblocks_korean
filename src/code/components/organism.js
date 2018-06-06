import React, {PropTypes} from 'react';

export function getDrakeImageUrl(org) {
  const baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/";
  return org ? baseUrl + org.getImageName() : null;
}

const OrganismView = ({org, id, className="", width=200, flipped=false, style={}, onClick, wrapper, separateClickableArea=false, showColorText=false }) => {
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
  function getOrganismDescription() {
    let descriptions = [];
    descriptions.push(org.species.name);
    if (org && org.phenotype && org.phenotype.characteristics) {
      for (const ch of Object.keys(org.phenotype.characteristics)) {
        if (ch !== 'liveliness' && ch !== 'health') {
          descriptions.push(ch + ": " + org.phenotype.characteristics[ch]);
        }
      }
    }
    return descriptions.join(", ");
  }
  let organismColorName = org.phenotype.characteristics.color;
  let organismDescription = getOrganismDescription();

  function handleClick() {
    if (onClick) onClick(id, org);
  }

  if (separateClickableArea) {
    return divWrapper(
      <div className={classes} id={id} style={style}>
        {url ? <img src={url} width={width} alt={organismDescription} title={organismColorName} /> : null}
        {showColorText && <div className="organism-color-text">{organismColorName}</div> }
        <div className="clickable-area"
              onMouseDown={onClick ? handleMouseDown : null}
              onClick={onClick ? handleClick : null} />
      </div>
    );
  }

  return divWrapper(
    <div className={classes} id={id} style={style}
          onMouseDown={onClick ? handleMouseDown : null}
          onClick={onClick ? handleClick : null}>
      {url ? <img src={url} width={width} alt={organismDescription} title={organismColorName} /> : null}
      {showColorText && <div className="organism-color-text">{organismColorName}</div> }
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
  wrapper: PropTypes.func,
  separateClickableArea: PropTypes.bool,
  showColorText: PropTypes.bool
};

export default OrganismView;
