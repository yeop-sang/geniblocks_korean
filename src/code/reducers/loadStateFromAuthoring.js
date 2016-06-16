import templates from '../templates';

export default function loadStateFromAuthoring(state, authoring, case_, challenge) {
  let authoredChallenge = authoring[case_][challenge],
      templateName = authoredChallenge.template,
      template = templates[templateName],
      authoredDrakesArray = template.authoredDrakesToDrakeArray(authoredChallenge),

      // turn authored alleles into completely-specified alleleStrings
      // (once we have nested arrays this will need to be tweaked)
      drakes = authoredDrakesArray.map(function(drakeDef) {
        let drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, drakeDef.sex);
        return {
          alleleString: drake.getAlleleString(),
          sex: drake.sex
        };
      });

  let goalMoves = null;
  if (template.calculateGoalMoves) {
    goalMoves = template.calculateGoalMoves(drakes);
  }

  return state.merge({
    template: templateName,
    drakes: drakes,
    trial: 1,
    moves: 0,
    goalMoves: goalMoves
  });
}
