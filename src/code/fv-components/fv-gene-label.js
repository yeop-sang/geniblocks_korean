import React, {PropTypes} from 'react';

const FVGeneLabelView = ({allele, chromosomeDescriptor, chromosomeHeight=122, stripe}) => {
    var chromStart;
    Object.keys(BioLogica.Species.Drake.geneList).forEach((geneName) => {
      const gene = BioLogica.Species.Drake.geneList[geneName];
      if (gene.alleles.indexOf(allele) > -1) {
        chromStart = gene.start;
      }
    });
    let bioChromHeight = BioLogica.Species.Drake.chromosomesLength[chromosomeDescriptor.name],
        stripeHeight = chromosomeHeight * .03,
        percentHeight = chromStart/bioChromHeight;

    // Manually adjust certain labels and stripes up for the time being
    let normalizedAllele = allele.toLowerCase();
    if (normalizedAllele === "fl" || normalizedAllele === "hl" || normalizedAllele.indexOf('a') === 0) {
      percentHeight -= .1;
    }

    const style = {marginTop: percentHeight * chromosomeHeight - stripeHeight * 3 + "px"},
          stripeStyle = {height: stripeHeight + "px"};

    let labelStyle = {marginTop: -stripeHeight * .8},
        lineStyle = Object.assign({}, labelStyle);
    
    if (normalizedAllele === "fl") {
      labelStyle.marginTop -= stripeHeight * 5;
      lineStyle.marginTop -= stripeHeight;
    }

    const line = stripe ? null : <div className="line" foo={chromosomeDescriptor.side} style={lineStyle}></div>,
          label = stripe ? null : <div style={labelStyle}>{BioLogica.Species.Drake.alleleLabelMap[allele]}</div>,
          stripeDiv = stripe && chromosomeDescriptor.side !== 'y' ? <div className="stripe" style={stripeStyle}></div> : null;
          
    return (
      <div className={"geniblocks fv-gene-label allele noneditable " + allele.toLowerCase()} key={allele} style={style}>
        {line}
        {stripeDiv}
        {label}
      </div>
    );
};

FVGeneLabelView.propTypes = {
  allele: PropTypes.string.isRequired,
  chromosomeHeight: PropTypes.number,
  chromosomeDescriptor: PropTypes.object,
  stripe: PropTypes.bool
};

export default FVGeneLabelView;
