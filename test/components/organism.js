import {assert} from 'chai';
import {shallow} from 'enzyme';
import React from 'react';
import OrganismView from '../../src/code/components/organism';

/* global describe, it */
describe("<OrganismView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<OrganismView org={drake}/>);
    assert(wrapper.find('div').hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').hasClass('organism'), "Should create a <div> with 'organism' class");
  });

  it("should create an <img> tag", function() {
    const wrapper = shallow(<OrganismView org={drake}/>);
    assert.equal(wrapper.find('img').length, 1, "Should create a single <img> tag");
  });

});