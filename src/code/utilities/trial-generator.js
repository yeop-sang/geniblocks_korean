import _ from 'lodash';

const ALL_COMBINATIONS = "all-combinations",
      RANDOMIZE_ORDER = "randomize-order";

var pastTrialData;

export function generateTrialDrakes(trialDef, trial=0) {
  if (trialDef.type === ALL_COMBINATIONS) {
    if (trial === 0) pastTrialData = [];

    let initialDrakeAlleles = generateComboDrakeAlleles(trialDef.baseDrake, trialDef.initialDrakeCombos, trial),
        targetDrakeAlleles  = generateComboDrakeAlleles(trialDef.baseDrake, trialDef.targetDrakeCombos,  trial),
        initialDrake = new BioLogica.Organism(BioLogica.Species.Drake, initialDrakeAlleles),
        targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeAlleles);

    for (let numTrials = 0; numTrials < 100; numTrials++) {
      if (arePhenotypesEqual(initialDrake, targetDrake)) {
        initialDrakeAlleles = generateComboDrakeAlleles(trialDef.baseDrake, trialDef.initialDrakeCombos, trial);
        initialDrake = new BioLogica.Organism(BioLogica.Species.Drake, initialDrakeAlleles);
      } else {
        break;
      }
    }
    if (arePhenotypesEqual(initialDrake, targetDrake)) {
      console.log("Failed to produce different initial and target drakes");
    }

    let initialDrakeSex = Math.trunc(2 * Math.random()),
        targetDrakeSex = Math.trunc(2 * Math.random()),
        initialDrakeObj = {alleles: initialDrakeAlleles, sex: initialDrakeSex},
        targetDrakeObj = {alleles: targetDrakeAlleles, sex: targetDrakeSex};

    return [initialDrakeObj, targetDrakeObj];
  }
  if (trialDef.type === RANDOMIZE_ORDER) {
    if (trialDef.drakes) {
      // randomize the order of the drakes
      return _.shuffle(
        _.map(trialDef.drakes, (drake) => {
                // combine drake alleles with base drake alleles
          const { alleles: drakeAlleles, sex: drakeSex, ...others } = drake,
                alleles = trialDef.baseDrake + ',' + drakeAlleles,
                // randomize sex if not specified
                sex = drakeSex != null ? drakeSex : Math.trunc(2 * Math.random());
          return { alleles, sex, ...others };
        })
      );
    }
  }
  return [];
}

function arePhenotypesEqual(drake1, drake2) {
  return drake1.getImageName() === drake2.getImageName();
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
