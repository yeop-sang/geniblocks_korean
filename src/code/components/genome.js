let ChromosomeView = require('./chromosome');

const GenomeView = ({org, hiddenAlleles, alleleChanged}) => {
  let pairWrappers = [];
  for (let chromosomeName of org.species.chromosomeNames) {
    let chrom = org.genetics.genotype.chromosomes[chromosomeName],
        pairs = [];
    for (let side in chrom) {
      pairs.push(
        <ChromosomeView
          org={org}
          chromosomeName={chromosomeName}
          side={side}
          hiddenAlleles={hiddenAlleles}
          labelsOnRight={pairs.length>0}
          alleleChanged={function(prevAllele, newAllele) {
            alleleChanged(chromosomeName, side, prevAllele, newAllele);
          }}/>
      );
    }
    pairWrappers.push(
      <div>
        { pairs }
      </div>
    );
  }
  return (
    <div className="geniblocks genome">
      { pairWrappers }
    </div>
  );
}

export default GenomeView;
