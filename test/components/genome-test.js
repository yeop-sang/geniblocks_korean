import GenomeTestView from '../../src/code/components/genome-test';

describe("<GenomeTestView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, ''),
        chromosomeNameCount = BioLogica.Species.Drake.chromosomeNames.length,
        chromosomeCount = 2 * chromosomeNameCount,  // chromosomes come in pairs
        geneCount = Object.keys(BioLogica.Species.Drake.geneList).length;

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<GenomeTestView org={drake} onSelectionChange={function() {}}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('genome-test'), "Should create a <div> with 'genome-test' class");
  });

  it("should create appropriate child components when all genes are visible", function() {
    const wrapper = shallow(<GenomeTestView org={drake} onSelectionChange={function() {}}/>);
    assert.lengthOf(wrapper.find('div.items'), chromosomeNameCount, "Should create three <div>s with 'items' class");
    assert.lengthOf(wrapper.find('div.genome-test-options'), chromosomeNameCount, "Should create three <div>s with 'genome-test-options' class");
    assert.lengthOf(wrapper.find('ChromosomeImageView'), chromosomeCount, "Should create six <ChromosomeImageView> components");
    assert.lengthOf(wrapper.find('TestPulldownView'), geneCount, "Should create a <TestPulldownView> component for each gene");
  });

  it("should create appropriate child components when selected genes are visible", function() {
    const wrapper = shallow(<GenomeTestView org={drake} userChangeableGenes={['tail', 'wings']}
                                            onSelectionChange={function() {}}/>);
    assert.lengthOf(wrapper.find('div.items'), chromosomeNameCount, "Should create three <div>s with 'items' class");
    assert.lengthOf(wrapper.find('div.genome-test-options'), chromosomeNameCount, "Should create three <div>s with 'genome-test-options' class");
    assert.lengthOf(wrapper.find('ChromosomeImageView'), chromosomeCount, "Should create six <ChromosomeImageView> components");
    assert.lengthOf(wrapper.find('TestPulldownView'), 2, "Should create a <TestPulldownView> component for each visible gene");
  });

});
