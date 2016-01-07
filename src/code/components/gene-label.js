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
    let alleles = BioLogica.Genetics.getGeneOfAllele(org.species, allele).alleles,
        alleleNames = alleles.map(a => org.species.alleleLabelMap[a]),
        alleleOptions = alleleNames.map((name, i) => (<option key={name} value={alleles[i]}>{name}</option>))
    return (
      <div className="geniblocks allele">
        <select value={ allele } onChange={ onAlleleChange }>
          { alleleOptions }
        </select>
      </div>
    );
  }
}

export default GeneLabelView;
