import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';

export default class BreedingContainer extends Component {

  render() {
    const { drakes, breed } = this.props;

    let motherDef = drakes[0][0],
        fatherDef = drakes[0][1],
        offspringDefs = drakes[1],
        mother = new BioLogica.Organism(BioLogica.Species.Drake, motherDef, 1),
        father = new BioLogica.Organism(BioLogica.Species.Drake, fatherDef, 0),
        offspring = offspringDefs.asMutable().map((def) => new BioLogica.Organism(BioLogica.Species.Drake, def)),
        offspringViews = offspring.map((o) => <OrganismView org={o} />);

    const onBreed = () => {
      breed(motherDef, fatherDef, 1, 20);
    };

    return (
      <div>
        <div>
          <OrganismView org={mother} />
          <OrganismView org={father} />
        </div>
        <div>
          <button onClick={onBreed}>Breed!</button>
        </div>
        <div>
          { offspringViews }
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    breed: PropTypes.func.isRequired
  };
}
