import React, {PropTypes} from 'react';
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
    }
});

const GeneLabelView = ({species, allele, editable=false, hiddenAlleles=[], onAlleleChange}) => {
  if (!editable) {
    const alleleName = species.alleleLabelMap[allele];
    return (
      <div className="geniblocks gene-label allele noneditable">
        <span>
          { alleleName }
        </span>
      </div>
    );
  } else {
    const alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
          alleleName = species.alleleLabelMap[allele],
          visibleAlleles = alleles.filter(a => hiddenAlleles.indexOf(a) === -1),
          alleleNames = visibleAlleles.map(a => species.alleleLabelMap[a]),
          alleleOptions = alleleNames.map((name, i) => (
                            {label:name, value:visibleAlleles[i]}
                          ));

    return (
      <div id='mountNode'>
          <Form defaultOption={{label: alleleName, value: allele}} options={alleleOptions} handleChange={onAlleleChange}/> 
      </div>
    );
  }
};

GeneLabelView.propTypes = {
  species: PropTypes.object.isRequired,
  allele: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  hiddenAlleles: PropTypes.array,
  onAlleleChange: PropTypes.func
};

export default GeneLabelView;
