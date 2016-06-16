import templates from '../templates';

export default function loadStateFromAuthoring(state, authoring, case_, challenge) {
  let authoredChallenge = authoring[case_][challenge],
      template = authoredChallenge.template,
      authoredDrakesArray = templates[template].authoredDrakesToDrakeArray(authoredChallenge),

      // turn authored alleles into completely-specified alleleStrings
      // (once we have nested arrays this will need to be tweaked)
      drakes = authoredDrakesArray.map(function(drakeDef) {
        let drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, drakeDef.sex);
        return {
          alleleString: drake.getAlleleString(),
          sex: drake.sex
        };
      });

  return state.merge({
    template: template,
    drakes: drakes,
    trial: 1,
    moves: 0
  });
}
