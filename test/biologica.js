import {assert} from 'chai';

/* global describe, it */
describe("BioLogica", function(){

  it("BioLogica is loaded successfully", function() {
    assert.isDefined(BioLogica);
  });

  it("Create drake", function() {
    const drake = new BioLogica.Organism(BioLogica.Species.Drake, '');
    assert.notEqual(drake.getAlleleString(), '');
  });

  it("Breed drakes", function() {
    const mother = new BioLogica.Organism(BioLogica.Species.Drake, '', BioLogica.FEMALE),
          father = new BioLogica.Organism(BioLogica.Species.Drake, '', BioLogica.MALE),
          uncrossedChild = BioLogica.breed(mother, father, false),
          crossedChild = BioLogica.breed(mother, father, true);
    assert.notEqual(uncrossedChild.getAlleleString(), '');
    assert.notEqual(crossedChild.getAlleleString(), '');
  });

});