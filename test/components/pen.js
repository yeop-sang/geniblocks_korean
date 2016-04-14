import PenView from '../../src/code/components/pen';

import OrganismGlowView from '../../src/code/components/organism-glow';

describe("<PenView />", function(){
  const drakes = [...Array(20).keys()].map( () => new BioLogica.Organism(BioLogica.Species.Drake, ''));

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<PenView orgs={drakes}/>);
    assert(wrapper.find('div').at(0).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(0).hasClass('pen'), "Should create a <div> with 'organism' class");
  });

  it("should create 20 <OrganismView> components", function() {
    const wrapper = shallow(<PenView orgs={drakes}/>);
    assert.lengthOf(wrapper.find('OrganismView'), 20, "Should create 20 <OrganismView> components");
  });

  it("clicking an <OrganismView> should trigger the onClick handler", function() {
    let clickedIndex;
    function handleClick(evt, index) { clickedIndex = index; }
    const wrapper = shallow(<PenView orgs={drakes} onClick={handleClick}/>),
          firstOrg = wrapper.find('OrganismView').first(),
          firstOrgID = firstOrg.prop('id');
    wrapper.find('OrganismView').first().simulate('click', { currentTarget: { id: firstOrgID }});
    assert.equal(clickedIndex, 0, "Clicking an <OrganismView> should select it");
  });

  it("can specify another class for the selected item", function() {
    const wrapper = shallow(<PenView orgs={drakes} selectedIndex={7}
                                    SelectedOrganismView={OrganismGlowView}/>);
    assert.lengthOf(wrapper.find('OrganismGlowView'), 1, "create a single SelectedOrganismView");
    assert.lengthOf(wrapper.find('OrganismView'), 19, "Should create 19 <OrganismView> components");
  });

});