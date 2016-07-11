import React, {PropTypes} from 'react';

import ChromosomeImageView from './chromosome-image';

const GameteImageView = ({isEgg, chromosomes=[], className}) => {
  let gameteImage = isEgg ? getEggImage() : getSpermImage(),
      chromosomeImages = [];

  for(var i = 0; i < chromosomes.length; i++){
    let chromosome = chromosomes[i];
    chromosomeImages.push(
      <ChromosomeImageView
        empty={!chromosome}
        width={6}
        height={chromosome && chromosome.side === "y" ? 15 : 20}
        split={8}
      />
    );
  }

  let chromosomeStyle = {
    position: "absolute",
    top:  isEgg ? 29 : 11,
    left: isEgg ? 19 : 18,
    display: "flex",
    opacity: 0.4
  };

  return (
    <div className={className}>
      <div style={chromosomeStyle}>
      { chromosomeImages }
      </div>
      { gameteImage }
    </div>
  );
};

function getEggImage() {
  return (
    <svg width={150} height={90} xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          d="m 0.987473,40.556786 c 0,-21.857735 14.961774,-39.5625 33.433099,-39.5625 18.471326,0 33.433099,17.704765 33.433099,39.5625 0,21.857735 -14.961773,39.5625 -33.433099,39.5625 -18.471325,0 -33.433099,-17.704765 -33.433099,-39.5625 z"
          fill="#ffffff" fillOpacity="0.5" stroke="#222222" strokeWidth="2"
        />
      </g>
    </svg>
  );
}

function getSpermImage() {
  return (
    <svg width={150} height={90} xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          d="m 1.009921,20.994286 c 0,-11.049724 14.991709,-20 33.499999,-20 18.50829,0 33.5,8.950276 33.5,20 0,11.049724 -14.99171,20 -33.5,20 -18.50829,0 -33.499999,-8.950276 -33.499999,-20 z"
          fill="#ffffff" fillOpacity="0.5" stroke="#222222" strokeWidth="2"
        />
        <path
          d="m 68.08492,21.244276 c 13.95833,1.04167 9.16667,-12.29167 23.75,-13.125 13.33333,0.41667 7.91667,21.45833 19.375,21.875 13.125,-0.625 10.625,-16.25 21.25,-16.875 10.625,-0.625 8.125,12.5 17.5,8.75"
          fill="none" stroke="#222222" strokeWidth="2"
        />
      </g>
    </svg>
  );
}

GameteImageView.propTypes = {
  isEgg: PropTypes.bool.isRequired,
  chromosomes: PropTypes.array,
  className: PropTypes.string
};

export default GameteImageView;
