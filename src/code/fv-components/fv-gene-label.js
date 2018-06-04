import React, {PropTypes} from 'react';
import GeneticsUtils from '../utilities/genetics-utils';

const SimpleSelect = require("react-selectize").SimpleSelect;

const Form = React.createClass({
    propTypes: {
      defaultOption: PropTypes.object,
      options: PropTypes.array,
      handleChange: PropTypes.func
    },

  render: function () {
    let self = this;
      return <SimpleSelect
        onValueChange={this.props.handleChange}
        options={this.props.options}
        hideResetButton={true}
        editable={false}
        disabled={false}
        defaultValue={this.props.defaultOption}
        renderValue={function (item) {
          self.currentValue = item.label;
          return <div className="fv-gene-option-value">
            <div>{item.label}</div>
          </div>;
        }}
        renderOption={function (item) {
          return <div className="fv-gene-option">
            {item.label === self.currentValue && <div className="selected">&nbsp;</div>}
            <div>{item.label}</div>
          </div>;
          }}
      ></SimpleSelect>;
    },
    componentDidMount: function() {
      document.querySelectorAll("input").forEach(input => input.setAttribute('readonly', true));
    }
});

const normalizeAllele = (allele) => {
  // alleles that differ by more than case require special mapping
  const nameMap = { "a1": "a", "a2": "a", "tk": "t"},
        normalized = allele.toLowerCase();
  return nameMap[normalized] || normalized;
};

const FVGeneLabelView = ({species, editable, allele, hiddenAlleles=[], onAlleleChange, chromosomeDescriptor, chromosomeHeight=122, stripe, defaultUnknown}) => {
    const geneStripeInfo = GeneticsUtils.getGeneStripeInfoForAllele(species, chromosomeDescriptor.name, allele);
    let stripeHeight = chromosomeHeight * .03,
        percentHeight = geneStripeInfo.geneStart / geneStripeInfo.chromosomeHeight;

    // The normalized allele is added as a class and used for css layout.
    // Using gene name instead of allele would avoid the need for normalization.
    const normalizedAllele = normalizeAllele(allele);
    // Manually adjust certain labels and stripes up for the time being
    if (normalizedAllele === "fl" || normalizedAllele === "hl" || normalizedAllele=== "a") {
      percentHeight -= .1;
    } else if (normalizedAllele=== "d") {
      percentHeight -= .05;
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
      let renderedAlleleOptions = [];
      let defaultUnknownOption = { label: "?", value: "?" };
      if (!defaultUnknown) {
        let sortedAlleleOptions = alleleOptions.filter(a => a.value !== allele);
        sortedAlleleOptions.unshift({ label: alleleName, value: allele });
        renderedAlleleOptions = sortedAlleleOptions;
      } else {
        renderedAlleleOptions = alleleOptions;
        renderedAlleleOptions.unshift(defaultUnknownOption);
      }
      let defaultDisplayOption = defaultUnknown ? defaultUnknownOption : { label: alleleName, value: allele };

      label = stripe ? null : (
        <div id='mountNode'>
          <Form defaultOption={defaultDisplayOption} options={renderedAlleleOptions} handleChange={onAlleleChange}/>
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
  stripe: PropTypes.bool,
  defaultUnknown: PropTypes.bool
};

export default FVGeneLabelView;
