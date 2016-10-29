import GeneticsUtils from './genetics-utils';
import _ from 'lodash';

const ALL_COMBINATIONS = "all-combinations",
      RANDOMIZE_ORDER = "randomize-order";

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
  if (trialDef.type === RANDOMIZE_ORDER) {
    if (trialDef.drakes) {
      // randomize the order of the drakes
      return _.shuffle(
        _.map(trialDef.drakes, (drake) => {
                // combine drake alleles with base drake alleles
          const dashAlleles = trialDef.baseDrake + ',' + drake.alleles,
                alleles = GeneticsUtils.convertDashAllelesToABAlleles(dashAlleles),
                // randomize sex if not specified
                sex = drake.sex != null ? drake.sex : Math.trunc(2 * Math.random());
          return { alleles, sex };
        })
      );
    }
  }
  return [];
}

function generateComboDrakeAlleles(base, combos, trial) {
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

  _.times(numCompletedTrials, function (trial) {
    _.times(numKeys, function (i) {
      if (!pastTrials[pastTrialData[trial][0][i]]) pastTrials[pastTrialData[trial][0][i]] = [];
      pastTrials[pastTrialData[trial][0][i]].push(pastTrialData[trial][1][i]);
    });
  });

  // pastTrials is an object showing, for each column of an initial drake, what columns
  // have been shown in the past for a trial drake
  /**
    {
      0: [0,1],
      1: [0,0],
      2: [1,0],
      3: [1,1]
    }
  */

  var targetColumns = combos[1].length,
      possibleTargetColumns = _.range(targetColumns),     // [0,1]
      result = {};

  for (let column in pastTrials) {
    let remainingPossibleTargetColumns = possibleTargetColumns.slice(0);
    _.forEach(pastTrials[column], (shown) =>
      remainingPossibleTargetColumns = _.without(remainingPossibleTargetColumns, shown)
    );
    if (remainingPossibleTargetColumns.length === 0) {
      remainingPossibleTargetColumns = _.range(targetColumns);
    }
    result[column] = _.sample(remainingPossibleTargetColumns);
  }

  var currentInitialDrake = pastTrialData[pastTrialData.length-1][0];

  return currentInitialDrake.map(column => result[column]);
}
