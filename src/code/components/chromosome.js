import {PropTypes} from 'react';
import ChromosomeImageView from './chromosome-image';
import GeneLabelView from './gene-label';
import GeneticsUtils from '../utilities/genetics-utils';

const ChromosomeView = ({org, chromosomeName, side, hiddenAlleles=[], editable=true, alleleChanged, labelsOnRight=true}) => {
  let alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      visibleAlleles = GeneticsUtils.filterAlleles(alleles, hiddenAlleles, org.species),
      labels  = visibleAlleles.map(a => {
        return (
          <GeneLabelView key={a} species={org.species} allele={a} editable={editable}
          onAlleleChange={function(event) {
            alleleChanged(a, event.target.value);
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
};

ChromosomeView.propTypes = {
  org: PropTypes.object.isRequired,
  chromosomeName: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired,
  hiddenAlleles: PropTypes.array,
  editable: PropTypes.bool,
  alleleChanged: PropTypes.func,
  labelsOnRight: PropTypes.bool
};

export default ChromosomeView;
