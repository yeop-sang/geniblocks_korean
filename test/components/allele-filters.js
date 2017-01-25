import AlleleFilters from '../../src/code/components/allele-filters';

describe("<AlleleFilters />", function(){

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<AlleleFilters species={BioLogica.Species.Drake}
                                          onFilterChange={function() {}}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('allele-filters'), "Should create a <div> with 'allele-filters' class");
  });

  const geneList = BioLogica.Species.Drake.geneList,
        geneCount = Object.keys(geneList).length,
        alleleCount = Object.keys(geneList).reduce((sum, g) => sum += geneList[g].alleles.length, 0);

  it("should create appropriate elements when no visible genes are specified", function() {
    const wrapper = shallow(<AlleleFilters species={BioLogica.Species.Drake}
                                          onFilterChange={function() {}}/>),
          checkboxWrapper = wrapper.find('input[type="checkbox"]'),
          checkedWrapper = checkboxWrapper.filterWhere(w => w.prop('defaultChecked'));
    assert.lengthOf(wrapper.find('div.gene-allele-list'), geneCount, "correct number of 'gene-allele-list' elements");
    assert.lengthOf(checkboxWrapper, alleleCount, "correct number of allele checkboxes");
    assert.lengthOf(checkedWrapper, alleleCount, "correct number of checked alleles");
  });

  it("should create appropriate elements when visible genes are specified and alleles are disabled", function() {
    const wrapper = shallow(<AlleleFilters species={BioLogica.Species.Drake}
                                          visibleGenes={['tail', 'armor']} disabledAlleles={['A1', 'A2']}
                                          onFilterChange={function() {}}/>),
          checkboxWrapper = wrapper.find('input[type="checkbox"]'),
          checkedWrapper = checkboxWrapper.filterWhere(w => w.prop('defaultChecked'));
                                    // just tail and armor
    assert.lengthOf(wrapper.find('div.gene-allele-list'), 2, "correct number of 'gene-allele-list' elements");
                                    // 3 tail 3 armor
    assert.lengthOf(checkboxWrapper, 6, "correct number of allele checkboxes");
                                    // -2 disabled armor alleles
    assert.lengthOf(checkedWrapper, 4, "correct number of checked alleles");
  });

  it("onFilterChange() should be called when checkboxes are clicked", function() {
    let filterChanges = {};

    function handleFilterChange(evt, allele, checked) {
      filterChanges[allele] = checked;
    }

    const wrapper = shallow(<AlleleFilters species={BioLogica.Species.Drake}
                                          disabledAlleles={['a']}
                                          onFilterChange={handleFilterChange}/>),
          checkboxWrapper = wrapper.find('input[type="checkbox"]'),
          tAlleleWrapper = checkboxWrapper.filterWhere(w => w.prop('value') === 't'),
          aAlleleWrapper = checkboxWrapper.filterWhere(w => w.prop('value') === 'a');
    tAlleleWrapper.simulate('change', { target: { value: 't', checked: false }});
    assert.equal(filterChanges['t'], false, "'change' events should trigger onFilterChange()");
    aAlleleWrapper.simulate('change', { target: { value: 'a', checked: true }});
    assert.equal(filterChanges['a'], true, "'change' events should trigger onFilterChange()");
 });

});
