import {PropTypes} from 'react';

const OrganismView = ({org, id, width=200, style={}, onClick }) => {
  const baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
        url     = baseUrl + org.getImageName();

  return (
    <div className="geniblocks organism" id={id} style={style} onMouseDown={onClick} onClick={onClick}>
      <img src={url} width={width} />
    </div>
  );
};

OrganismView.propTypes = {
  org: PropTypes.object.isRequired,
  id: PropTypes.string,
  index: PropTypes.number,
  width: PropTypes.number,
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default OrganismView;
