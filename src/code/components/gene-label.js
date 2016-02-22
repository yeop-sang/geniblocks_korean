const GeneLabelView = ({species, allele, editable, onAlleleChange}) => {
  if (!editable) {
    let alleleName = species.alleleLabelMap[allele];
    return (
      <div className="geniblocks allele noneditable">
        <span>
          { alleleName }
        </span>
      </div>
    );
  } else {
    let alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
        alleleNames = alleles.map(a => species.alleleLabelMap[a]),
        alleleOptions = alleleNames.map((name, i) => (<option key={name} value={alleles[i]}>{name}</option>));
    return (
      <div className="geniblocks allele">
        <select value={ allele } onChange={ onAlleleChange }>
          { alleleOptions }
        </select>
      </div>
    );
  }
};

GeneLabelView.propTypes = {
  species: React.PropTypes.object.isRequired,
  allele: React.PropTypes.string.isRequired,
  editable: React.PropTypes.bool.isRequired,
  onAlleleChange: React.PropTypes.func.isRequired
};

export default GeneLabelView;
