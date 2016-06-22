import _ from 'lodash';

const ALL_COMBINATIONS = "all-combinations";

var pastTrialData;

export function generateTrialDrakes(trialDef, trial=0) {
  if (trialDef.type === ALL_COMBINATIONS) {
    if (trial === 0) pastTrialData = [];

    let initialDrakeAlleles = generateComboDrakeAlleles(trialDef.baseDrake, trialDef.initialDrakeCombos, trial),
        targetDrakeAlleles  = generateComboDrakeAlleles(trialDef.baseDrake, trialDef.targetDrakeCombos,  trial),
        initialDrake = {alleles: initialDrakeAlleles, sex: 0},
        targetDrake = {alleles: targetDrakeAlleles, sex: 0};

    return [initialDrake, targetDrake];
  }
  return [];
}

function generateComboDrakeAlleles(base, combos, trial, isInitial) {
  let alleles = base,
      rows = combos.length,
      columns = combos[0].length,
      randomColumns = [];

  if (trial > 0 && pastTrialData[trial]) {
    randomColumns = getNextColumns(combos);
  }
  while (randomColumns.length < rows) {
    randomColumns = randomColumns.concat(_.shuffle(_.range(columns)));
  }
  if (randomColumns.length > rows) {
    randomColumns = _.take(randomColumns, rows);
  }
  console.log(randomColumns);
  // we now have an array either in the form [3,0,1,2] or [0,1,1,0]

  if (!pastTrialData[trial]) pastTrialData[trial] = [];
  pastTrialData[trial].push(randomColumns);

  let additionalAlleles = randomColumns.map((column, row) => combos[row][column]);

  return alleles + "," + additionalAlleles.join(",");
}

function getNextColumns(combos) {
  let numCompletedTrials = pastTrialData.length - 1,
      numKeys = pastTrialData[0][0].length,
      pastTrials = {};
  console.log(getNextColumns);
  _.times(numCompletedTrials, function (trial) {
    _.times(numKeys, function (i) {
      if (!pastTrials[pastTrialData[trial][0][i]]) pastTrials[pastTrialData[trial][0][i]] = [];
      pastTrials[pastTrialData[trial][0][i]].push(pastTrialData[trial][1][i]);
    });
  });

  console.log(pastTrials);
  return [];
}
