let ChromosomeImageView = require('./chromosome-image'),
    GeneLabelView       = require('./gene-label');

const ChromosomeView = ({org, chromosomeName, side, alleleChanged, labelsOnRight=true}) => {
  let alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      labels  = alleles.map(a => {
        return (
          <GeneLabelView key={a} species={org.species} allele={a} editable={true}
          onAlleleChange={function(event) {
            alleleChanged(a, event.target.value)
          }}/>
        );
      }),

      containerClass = "items";

  if (!labelsOnRight) {
    containerClass += " rtl";
  }

  return (
    <div className="geniblocks chromosome-container">
      <div className={ containerClass }>
        <ChromosomeImageView />
        <div className="labels">
          { labels }
        </div>
      </div>
    </div>
  );
}

export default ChromosomeView;
