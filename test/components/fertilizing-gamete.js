import {assert} from 'chai';
import {shallow} from 'enzyme';
import React from 'react';
import FertilizingGameteView from '../../src/code/components/fertilizing-gamete';

/* global describe, it */
describe("<FertilizingGameteView />", function(){
  const drake = new BioLogica.Organism(BioLogica.Species.Drake, '', BioLogica.FEMALE),
        gametes = drake.createGametes(10),
        gamete = gametes[0];

  it("should create appropriate child components", function() {
    const wrapper = shallow(<FertilizingGameteView gamete={gamete} type='mother'
                              id={0} fertilizationState='none' />);
    assert.lengthOf(wrapper.find('AnimatedGameteView'), 1, "Should create a single <AnimatedGameteView> component");
  });

});