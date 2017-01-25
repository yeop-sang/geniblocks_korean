import React, {PropTypes} from 'react';
import ChromosomeImageView from './chromosome-image';
import GeneLabelView from './gene-label';
import AlleleView from './allele';
import GeneticsUtils from '../utilities/genetics-utils';
/**
 * View of a single chromosome, with optional labels, pulldowns, and embedded alleles.
 *
 * Defined EITHER using a Biologica Chromosome object, OR with a Biologica organism,
 * chromosome name and side.
 */

const ChromosomeView = ({chromosome, org, chromosomeName, side, userChangeableGenes = [], visibleGenes = [], small = false, editable = true, selected = false, onAlleleChange, onChromosomeSelected, showLabels = true, showAlleles = false, labelsOnRight = true, orgName, displayStyle = {}}) => {
  var containerClass = "items",
      empty = false,
      yChromosome = false,
      labelsContainer, allelesContainer, chromId;

  if (org && chromosomeName && side) {
    chromosome = org.getGenotype().chromosomes[chromosomeName][side];
  }

  if (chromosome) {
    let alleles = chromosome.alleles,
        visibleAlleles = GeneticsUtils.filterVisibleAlleles(alleles, userChangeableGenes, visibleGenes, chromosome.species);

    if (showLabels) {
      let labels = visibleAlleles.map(a => {
        return (
          <GeneLabelView key={a.allele} species={chromosome.species} allele={a.allele} editable={editable && a.editable}
          onAlleleChange={function(event) {
            onAlleleChange(a.allele, event.target.value);
          }}/>
        );
      });

      labelsContainer = (
        <div className="labels">
          { labels }
        </div>
      );

      if (!labelsOnRight) {
        containerClass += " rtl";
      }
    }

    if (showAlleles) {
      let alleleSymbols = visibleAlleles.map(a => {
        return (
          <AlleleView key={a.allele} allele={a.allele} />
        );
      });

      allelesContainer = (
        <div className="alleles">
          { alleleSymbols }
        </div>
      );
    }

    if (chromosome.side === "y") {
      yChromosome = true;
    }

    chromId = orgName + chromosome.chromosome + chromosome.side;
  } else {
    chromId = orgName;
    empty = true;
  }
  const handleSelect = function(evt) {
    if (onChromosomeSelected) {
      onChromosomeSelected(evt.currentTarget);
    }
  };

  return (
    <div className="geniblocks chromosome-container" onClick={ handleSelect } >
      <div className={ containerClass }>
        <div className="chromosome-allele-container" id={chromId} style={displayStyle}>
          <ChromosomeImageView small={small} empty={empty} bold={selected} yChromosome={yChromosome}/>
          { allelesContainer }
        </div>
        { labelsContainer }
      </div>
    </div>
  );
};

ChromosomeView.propTypes = {
  org: PropTypes.object,
  chromosomeName: PropTypes.string,
  side: PropTypes.string,
  chromosome: PropTypes.object,
  userChangeableGenes: PropTypes.array,
  visibleGenes: PropTypes.array,
  small: PropTypes.bool,
  editable: PropTypes.bool,
  selected: PropTypes.bool,
  showLabels: PropTypes.bool,
  showAlleles: PropTypes.bool,
  labelsOnRight: PropTypes.bool,
  displayStyle: PropTypes.object,
  onAlleleChange: PropTypes.func,
  onChromosomeSelected: PropTypes.func,
  orgName: PropTypes.string
};

export default ChromosomeView;
