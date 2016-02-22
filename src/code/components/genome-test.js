let ChromosomeImageView = require('./chromosome-image'),
    TestPulldownView = ({species, allele}) => {
      let alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
          alleleNames = alleles.map(a => species.alleleLabelMap[a]),
          numAlleles = alleleNames.length,
          possibleCombos = [],
          i, j;

      for (i = 0; i < numAlleles; i++) {
        for (j = i; j < numAlleles; j++) {
          let key = i + " " + j,
              string = alleleNames[i] + " / " + alleleNames[j];
          possibleCombos.push(<option key={key} value={key}>{string}</option>);
        }
      }
      possibleCombos.unshift(<option key="placeholder" value="" disabled="disabled">Select a Genotype</option>);
      return (
        <select>
          { possibleCombos }
        </select>
      );
    };

const GenomeTestView = ({org, hiddenAlleles, selectionChanged}) => {
  let pairWrappers = [];
  for (let chromosomeName of org.species.chromosomeNames) {
    let chrom = org.genetics.genotype.chromosomes[chromosomeName],
        alleles = chrom[Object.keys(chrom)[0]].alleles,
        pulldowns = alleles.map(a => {
          return (
            <TestPulldownView key={a} species={org.species} allele={a} />
          );
        });

    pairWrappers.push(
      <div className="items">
        <ChromosomeImageView />
        <ChromosomeImageView />
        <div className="genome-test-options">
          { pulldowns }
        </div>
      </div>
    );
  }
  return (
    <div className="geniblocks genome-test">
      { pairWrappers }
    </div>
  );
}

export default GenomeTestView;
