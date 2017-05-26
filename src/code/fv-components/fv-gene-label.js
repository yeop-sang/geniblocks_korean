import React, {PropTypes} from 'react';
import GeneticsUtils from '../utilities/genetics-utils';

const SimpleSelect = require("react-selectize").SimpleSelect;

const Form = React.createClass({
    propTypes: {
      defaultOption: PropTypes.object,
      options: PropTypes.array,
      handleChange: PropTypes.func
    },

    // render :: a -> ReactElement
    render: function(){
        return <SimpleSelect defaultValue={this.props.defaultOption} onValueChange={this.props.handleChange} options = {this.props.options} hideResetButton={true} editable={false} disabled={false}></SimpleSelect>;
    },

    componentDidMount: function() {
      document.querySelectorAll("input").forEach(input => input.setAttribute('readonly', true));
    }
});

const FVGeneLabelView = ({species, editable, allele, hiddenAlleles=[], onAlleleChange, chromosomeDescriptor, chromosomeHeight=122, stripe}) => {
    const geneStripeInfo = GeneticsUtils.getGeneStripeInfoForAllele(species, chromosomeDescriptor.name, allele);
    let stripeHeight = chromosomeHeight * .03,
        percentHeight = geneStripeInfo.geneStart / geneStripeInfo.chromosomeHeight;

    // Manually adjust certain labels and stripes up for the time being
    let normalizedAllele = allele.toLowerCase();
    if (normalizedAllele === "a1" || normalizedAllele === "a2") {
      normalizedAllele = "a";
    }
    if (normalizedAllele === "fl" || normalizedAllele === "hl" || normalizedAllele=== "a") {
      percentHeight -= .1;
    }

    const style = {marginTop: percentHeight * chromosomeHeight - stripeHeight * 3 + "px"},
          stripeStyle = {height: stripeHeight + "px"};

    const line = stripe ? null : <div className="line"></div>,
          stripeDiv = stripe && chromosomeDescriptor.side !== 'y' ? <div className="stripe" style={stripeStyle}></div> : null,
          alleleName = species.alleleLabelMap[allele];

    let label;
    if (!editable) {
      label = stripe ? null : <div className="fv-gene-label-text">{alleleName}</div>;
    } else {
      const alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
            visibleAlleles = alleles.filter(a => hiddenAlleles.indexOf(a) === -1),
            alleleNames = visibleAlleles.map(a => species.alleleLabelMap[a]),
            alleleOptions = alleleNames.map((name, i) => (
                              {label:name, value:visibleAlleles[i]}
                            ));

      label = stripe ? null : (
        <div id='mountNode'>
            <Form defaultOption={{label: alleleName, value: allele}} options={alleleOptions} handleChange={onAlleleChange}/> 
        </div>
      );
    }
          
    return (
      <div className={"geniblocks fv-gene-label allele noneditable " + normalizedAllele} key={allele} style={style}>
        {line}
        {stripeDiv}
        {label}
      </div>
    );
};

FVGeneLabelView.propTypes = {
  allele: PropTypes.string.isRequired,
  species: PropTypes.object,
  hiddenAlleles: PropTypes.array,
  onAlleleChange: PropTypes.func,
  editable: PropTypes.bool,
  chromosomeHeight: PropTypes.number,
  chromosomeDescriptor: PropTypes.object,
  stripe: PropTypes.bool
};

export default FVGeneLabelView;
