import React, {PropTypes} from 'react';

import ChromosomeImageView from '../components/chromosome-image';

const FVGameteImageView = ({chromosomes=[], id, className, style, displayStyle}) => {

  const isOvum = className.indexOf('ovum') >= 0,
        // defaultImageWidth = 150,
        // defaultImageHeight = 90,
        scale = displayStyle && (displayStyle.size != null) ? displayStyle.size : 1.0;
        // imageWidth = defaultImageWidth * scale,
        // imageHeight = defaultImageHeight * scale;

  const containerStyle = {
    position: "relative",
    // width: imageWidth + "px",
    // height: imageHeight + "px"
  };

  if (displayStyle != null){
    containerStyle.display = displayStyle.display;
  }

  let chromosomeImages = [];

  for(var i = 0; i < chromosomes.length; i++){
    let chromosome = chromosomes[i];
    chromosomeImages.push(
      <ChromosomeImageView
        key={i}
        empty={false}
        color={chromosome ? '#2CEBFE' : '#0B44DA'}
        width={10 * scale}
        height={(chromosome && chromosome.side === "y" ? 30 : 40) * scale}
        split={12 * scale}
      />
    );
  }

  let chromosomeStyle = {
    position: "absolute",
    top:  55 * scale,
    left: (isOvum ? 50 : 40) * scale + 15,
    display: "flex",
    opacity: 0.4
  };

  return (
    <div id={id} className={className} style={style}>
      <div className="gamete-container" style={containerStyle}>
        <div style={chromosomeStyle}>
          { chromosomeImages }
        </div>
      </div>
    </div>
  );
};

FVGameteImageView.propTypes = {
  isEgg: PropTypes.bool.isRequired,
  chromosomes: PropTypes.array,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  displayStyle: PropTypes.shape({
    display: PropTypes.string,
    size: PropTypes.number,
    fillColor: PropTypes.string
  }),
  onClick: PropTypes.func
};

export default FVGameteImageView;
