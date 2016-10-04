import React, {PropTypes} from 'react';
import OrganismView from './organism';

/**
 * Presents either a BioLogica organism or a simple number within a square border.
 * Designed to be used as trial feedback indicating the number of trials successfully
 * completed, for instance.
 *
 * @param {string} id - a unique id for CSS purposes
 * @param {string} className - CSS class to be applied
 * @param {number} ordinal - the numeric value to be represented if no organism specified
 * @param {BioLogica.Organism} organism - the organism to be represented
 * @param {number} size - the width and height of the view
 */
const OrdinalOrganismView = ({id, className, ordinal, organism, size=32, ...other}) => {
  const containerStyle = { width: size, height: size },
        orgView = organism != null
                    ? <OrganismView id={`${id}-organism`} org={organism} width={size} {...other} />
                    : <div className='ordinal'>
                        {ordinal}
                      </div>;

  return (
    <div id={id} className={`geniblocks ordinal-organism ${className}`} style={containerStyle}>
      { orgView }
    </div>
  );
};

OrdinalOrganismView.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  ordinal: PropTypes.number,
  organism: PropTypes.object,
  size: PropTypes.number
};

export default OrdinalOrganismView;
