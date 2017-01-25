import React, {PropTypes} from 'react';

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
          visibleAlleles = alleles.filter(a => hiddenAlleles.indexOf(a) === -1),
          alleleNames = visibleAlleles.map(a => species.alleleLabelMap[a]),
          alleleOptions = alleleNames.map((name, i) => (
                            <option key={name} value={visibleAlleles[i]}>{name}</option>)
                          );
    return (
      <div className="geniblocks gene-label allele editable">
        <select value={ allele } onChange={ onAlleleChange }>
          { alleleOptions }
        </select>
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
