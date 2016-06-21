import templates from '../templates';

export function loadStateFromAuthoring(state, authoring, challenge) {
  let trial = state.trial ? state.trial : 1;
  let challenges = authoring[state.case].length;
  let authoredChallenge = authoring[state.case][challenge],
      templateName = authoredChallenge.template,
      template = templates[templateName],
      trials = authoredChallenge.targetDrakes,
      authoredDrakesArray = template.authoredDrakesToDrakeArray(authoredChallenge, trial),
      
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
    trial,
    trials,
    challenge,
    challenges,
    moves: 0,
    goalMoves: goalMoves,
    showingInfoMessage: false,
    userDrakeHidden: true,
    trialSuccess: false,
    challengeComplete: false
  });
}

export function loadNextTrial(state) {
  let trial = state.trial;
  if (state.trialSuccess){
    trial = (state.trial < state.trials.length) ? (trial+1) : 1;
  }
      
  let drakeDef = state.trials[trial-1];
  let drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, drakeDef.sex);
  let drakes = [state.drakes[0], state.drakes[1]];
  drakes[1] = {
      alleleString: drake.getAlleleString(),
      sex: drake.sex
  };

  let goalMoves = null;
  let template = templates[state.template];
  if (template.calculateGoalMoves) {
    goalMoves = template.calculateGoalMoves(drakes);
  }

  return state.merge({
    drakes: drakes,
    trial,
    moves: 0,
    goalMoves: goalMoves,
    showingInfoMessage: false,
    userDrakeHidden: true
  });
  
}