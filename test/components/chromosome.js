import ChromosomeView from '../../src/code/components/chromosome';

describe("<ChromosomeView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, ''),
        chromosome = drake.getGenotype().chromosomes[1]["a"];

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<ChromosomeView chromosome={chromosome}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('chromosome-container'), "Should create a <div> with 'chromosome-container' class");
  });

  it("should create intermediate <divs> with appropriate classes with labelsOnRight", function() {
    const wrapper = shallow(<ChromosomeView chromosome={chromosome}/>),
          itemsWrapper = wrapper.find('div.items'),
          labelsWrapper = wrapper.find('div.labels');
    assert.lengthOf(itemsWrapper, 1, "should create a single <div> with 'items' class");
    assert(!itemsWrapper.hasClass('rtl'), 1, "'items' <div> should not have 'rtl' class");
    assert.lengthOf(labelsWrapper, 1, "should create a single <div> with 'labels' class");
  });

  it("should create intermediate <divs> with appropriate classes without labelsOnRight", function() {
    const wrapper = shallow(<ChromosomeView chromosome={chromosome} labelsOnRight={false}/>),
          itemsWrapper = wrapper.find('div.items'),
          labelsWrapper = wrapper.find('div.labels');
    assert.lengthOf(itemsWrapper, 1, "should create a single <div> with 'items' class");
    assert(itemsWrapper.hasClass('rtl'), 1, "'items' <div> should have 'rtl' class");
    assert.lengthOf(labelsWrapper, 1, "should create a single <div> with 'labels' class");
  });

  it("should create no labels if showLabels is false", function() {
    const wrapper = shallow(<ChromosomeView chromosome={chromosome} showLabels={false}/>),
          labelsWrapper = wrapper.find('div.labels'),
          labels = labelsWrapper.find('div.gene-label');
    assert.lengthOf(labels, 0, "should create an empty 'labels' div");
  });

  it("should create a <ChromosomeImageView> tag", function() {
    const wrapper = shallow(<ChromosomeView chromosome={chromosome}/>);
    assert.lengthOf(wrapper.find('ChromosomeImageView'), 1, "Should create a single <ChromosomeImageView> component");
  });

  it("should create an empty chromosome if there is no organism", function() {
    const wrapper = shallow(<ChromosomeView />),
          labelsWrapper = wrapper.find('div.labels'),
          labels = labelsWrapper.find('div.gene-label'),
          allelesWrapper = wrapper.find('div.alleles');
    assert.lengthOf(labels, 0, "Should create no labels");
    assert.lengthOf(allelesWrapper, 0, "Should create no alleles");
    assert.lengthOf(wrapper.find('ChromosomeImageView'), 1, "Should still create a <ChromosomeImageView>");
  });

  it("should create the view when passed a chromosome object", function() {
    const wrapper = shallow(<ChromosomeView chromosome={chromosome}/>),
          labelsWrapper = wrapper.find('div.labels');
    assert.lengthOf(wrapper.find('ChromosomeImageView'), 1, "Should create a single <ChromosomeImageView> component");
    assert.lengthOf(labelsWrapper, 1, "should create a single <div> with 'labels' class");
  });

});
