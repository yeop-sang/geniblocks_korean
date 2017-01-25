import React, {PropTypes} from 'react';

const AlleleFiltersView = ({species, visibleGenes=[], disabledAlleles=[], onFilterChange}) => {
  let geneInputs = [],
      allVisible = visibleGenes.length === 0;

  for (const gene in species.geneList) {
    if (allVisible || visibleGenes.indexOf(gene) > -1) {
      const alleles = species.geneList[gene].alleles,
            alleleItems = alleles.map(allele => {
              const name = species.alleleLabelMap[allele],
                    checked = !(disabledAlleles.indexOf(allele) >= 0);
              return (
                <label key={name}>
                  <input type="checkbox" key={name} value={allele}
                          style={{ "marginLeft": "8px" }}
                          defaultChecked={checked} onChange={handleChange}/>
                  {name}
                </label>
              );
            });
      geneInputs.push(
        <div className="gene-allele-list" key={gene}>{alleleItems}</div>
      );
    }
  }

  function handleChange(evt) {
    const elt = evt.target,
          allele = elt && elt.value,
          isChecked = elt && elt.checked;
    if (onFilterChange && allele)
      onFilterChange(evt, allele, isChecked);
  }

  return (
    <div className="geniblocks allele-filters"
          style={{ "marginTop": "5px", "marginBottom": "5px" }}>
      { geneInputs }
    </div>
  );
};

AlleleFiltersView.propTypes = {
  species: PropTypes.object.isRequired,
  visibleGenes: PropTypes.arrayOf(PropTypes.string),
  disabledAlleles: PropTypes.arrayOf(PropTypes.string),
  onFilterChange: PropTypes.func.isRequired
};

export default AlleleFiltersView;
