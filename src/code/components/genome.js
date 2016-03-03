import ChromosomeView from './chromosome';

const GenomeView = ({org, hiddenAlleles = [], alleleChanged}) => {
  let pairWrappers = [];
  for (let chromosomeName of org.species.chromosomeNames) {
    let chrom = org.genetics.genotype.chromosomes[chromosomeName],
        pairs = [];
    for (let side in chrom) {
      pairs.push(
        <ChromosomeView
          org={org}
          key={pairs.length + 1}
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
      <div key={pairWrappers.length + 1}>
        { pairs }
      </div>
    );
  }
  return (
    <div className="geniblocks genome">
      { pairWrappers }
    </div>
  );
};

GenomeView.propTypes = {
  org: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.array,
  alleleChanged: React.PropTypes.func.isRequired
};

export default GenomeView;
