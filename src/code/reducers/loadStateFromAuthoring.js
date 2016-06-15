export default function loadStateFromAuthoring(state, authoring, case_, challenge) {
  let authoredChallenge = authoring[case_][challenge],
      newState = state.set("template", authoredChallenge.template),

      // turn authored alleles into completely-specified alleleStrings
      drakes = authoredChallenge.drakes.map(function(drakeDef) {
        let drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, drakeDef.sex);
        return {
          alleleString: drake.getAlleleString(),
          sex: drake.sex
        };
      });

  newState = newState.set("drakes", [ drakes ]);
  newState = newState.set("trial", 1);
  newState = newState.set("moves", 0);
  return newState;
}
