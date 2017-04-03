import React, {PropTypes} from 'react';

const FVGeneLabelView = ({allele, species, chromosomeName, chromosomeHeight=122, stripe}) => {
    var chromStart;
    Object.keys(BioLogica.Species.Drake.geneList).forEach((geneName) => {
      const gene = BioLogica.Species.Drake.geneList[geneName];
      if (gene.alleles.indexOf(allele) > -1) {
        chromStart = gene.start;
        if (chromosomeName===1) {
          console.log(allele + chromStart);
        }
      }
    });
    const bioChromHeight = BioLogica.Species.Drake.chromosomesLength[chromosomeName],
          stripeHeight = chromosomeHeight * .04,
          percentHeight = chromStart/bioChromHeight,
          style = {marginTop: percentHeight * chromosomeHeight - stripeHeight * 3 + "px"},
          stripeStyle = {height: stripeHeight + "px"},
          labelOffsetStyle = {marginTop: -stripeHeight * .6},
          line = stripe ? null : <div className="line" style={labelOffsetStyle}></div>,
          label = stripe ? null : species.alleleLabelMap[allele];
          
    return (
      <div className={"geniblocks fv-gene-label allele noneditable " + allele.toLowerCase()} key={allele} style={style}>
        {line}
        <div className="stripe" style={stripeStyle}></div>
        <div style={labelOffsetStyle}>{label}</div>
      </div>
    );
};

FVGeneLabelView.propTypes = {
  species: PropTypes.object.isRequired,
  allele: PropTypes.string.isRequired,
  chromosomeHeight: PropTypes.number,
  chromosomeName: PropTypes.string,
  stripe: PropTypes.bool
};

export default FVGeneLabelView;
