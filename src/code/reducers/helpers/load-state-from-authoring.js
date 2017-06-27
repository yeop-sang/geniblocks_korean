import templates from '../../templates';
import GeneticsUtils from '../../utilities/genetics-utils';
import { range, shuffle, assign } from 'lodash';
import AuthoringUtils from '../../utilities/authoring-utils';
import { notificationType } from '../../modules/notifications';

/**
 * Tolerant splitter into a list of strings.
 * @param list - null, "one, two" or ["one", "two"]
 * returns ["one", "two"]
 */
function split(list) {
  if (list && list.split) return list.split(",").map(item => item.trim());
  if (Array.isArray(list)) return list;
  return [];
}

function templateFromAuthoredChallenge(authoredChallenge) {
  const templateName = authoredChallenge.template,
        template = templateName && templates[templateName];
  return template;
}

function trialFromState(state) {
  return state.trial || 0;
}

function processAuthoredBaskets(authoredChallenge, state) {
  const baskets = authoredChallenge && authoredChallenge.baskets;
  return baskets || state.baskets;
}

function processAuthoredGametes(authoredChallenge, drakes, state) {
  const template = templateFromAuthoredChallenge(authoredChallenge),
        trial = trialFromState(state),
        parentPools = template.authoredGametesToGametePools &&
                        template.authoredGametesToGametePools(authoredChallenge, drakes, trial);
  return parentPools
            ? state.gametes.merge({ parentPools })
            : state.gametes;
}

function processAuthoredDrakes(authoredChallenge, authoredTrialNumber, template, trialNumber) {
  // takes authored list of named drakes ("mother", etc) and returns an
  // array specific for this template
  const authoredDrakesArray = template.authoredDrakesToDrakeArray(authoredChallenge, authoredTrialNumber, trialNumber);
  let   alleleString = null,
        linkedGeneDrake = null;

  // turn authored alleles into completely-specified alleleStrings
  let drakes = authoredDrakesArray.map(function(drakeDef, i) {
    if (!drakeDef) return null;
    // Keep the drake as female until the end, so no sex-linked information is lost for linked drakes
    let femaleDrake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, BioLogica.FEMALE);

    alleleString = femaleDrake.getAlleleString();
    if (authoredChallenge.linkedGenes) {
      if (i === authoredChallenge.linkedGenes.drakes[0]) {
        linkedGeneDrake = femaleDrake;
      } else if (authoredChallenge.linkedGenes.drakes.indexOf(i)) {
        let linkedGenes = split(authoredChallenge.linkedGenes.genes);
        for (let gene of linkedGenes) {
          let copyIntoGenes = femaleDrake.genetics.genotype.getAlleleString([gene], femaleDrake.genetics);
          let masterGenes = linkedGeneDrake.genetics.genotype.getAlleleString([gene], femaleDrake.genetics);
          alleleString = alleleString.replace(copyIntoGenes, masterGenes);
        }
      }
    }
    let fixedDrake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, drakeDef.sex);

    let secondXAlleles = null;
    if (drakeDef.sex === BioLogica.MALE) {
      // Store any sex-linked alleles from the authoring document which would be lost because the drake is male
      let fixedFemaleDrake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, BioLogica.FEMALE);
      secondXAlleles = GeneticsUtils.computeExtraAlleles(fixedFemaleDrake, fixedDrake);
    }

    return assign({}, secondXAlleles ? {secondXAlleles: secondXAlleles} : null, {
      alleleString: fixedDrake.getAlleleString(),
      sex: fixedDrake.sex,
    });

  });
  return drakes;
}

// Returns an array [0...len], optionally shuffled
function createTrialOrder(trial, trials, currentTrialOrder, doShuffle) {
  if (trial > 0)
    return currentTrialOrder;
  if (!trials)
    return [0];
  if (doShuffle)
    return shuffle( range(trials.length) );
  return range(trials.length);
}

export function loadStateFromAuthoring(state, authoring) {
  let trial = state.trial ? state.trial : 0;

  const challenges = AuthoringUtils.getChallengeCount(authoring, state.routeSpec.level, state.routeSpec.mission),
        authoredChallenge = AuthoringUtils.getChallengeDefinition(authoring, state.routeSpec),
        authoredChallengeMetadata = AuthoringUtils.getChallengeMeta(authoring, state.routeSpec);
  if (!authoredChallenge) return state;

  const templateName = authoredChallenge.template,
        template = templateName && templates[templateName];
  if (!template) return state;

  let userChangeableGenes = authoredChallenge.userChangeableGenes;
  // Changeable genes are either authored in the form "wings, legs" or [{mother: "wings", father:""}, {mother: "", father: "wings"}]
  if (typeof userChangeableGenes === "object") {
    let userChangeableGenesByTrial = [];
    for (let trial = 0; trial < userChangeableGenes.length; trial++) {
      userChangeableGenesByTrial.push({
        mother: split(userChangeableGenes[trial].mother),
        father: split(userChangeableGenes[trial].father)
      });
    }
    userChangeableGenes = userChangeableGenesByTrial;
  } else {
    userChangeableGenes = split(userChangeableGenes);
  }

  const challengeType = authoredChallenge.challengeType,
        interactionType = authoredChallenge.interactionType,
        instructions = authoredChallenge.instructions,
        visibleGenes = split(authoredChallenge.visibleGenes),
        hiddenAlleles = split(authoredChallenge.hiddenAlleles),
        baskets = processAuthoredBaskets(authoredChallenge, state),
        showUserDrake = (authoredChallenge.showUserDrake != null) ? authoredChallenge.showUserDrake : false,
        trials = authoredChallenge.targetDrakes,
        numTrials = authoredChallenge.numTrials || (trials ? trials.length : 1),
        trialOrder = createTrialOrder(trial, trials, state.trialOrder, authoredChallenge.randomizeTrials),
        drakes = processAuthoredDrakes(authoredChallenge, trialOrder[trial], template, trial),
        gametes = processAuthoredGametes(authoredChallenge, drakes, state),
        zoomUrl = authoredChallenge.zoomUrl,
        room = authoredChallengeMetadata.room || "simroom",
        roomInfo = (authoring && authoring.rooms) ? authoring.rooms[room] : {},
        location = {id: room, ...roomInfo},
        showingRoom = trial === 0,
        dialog = authoredChallengeMetadata.dialog;

  let goalMoves = null;
  if (template.calculateGoalMoves) {
    goalMoves = template.calculateGoalMoves(drakes);
  } else if (authoredChallenge.goalMoves) {
    goalMoves = authoredChallenge.goalMoves[trial];
  } else {
    goalMoves = -1;
  }

  let messages = [],
      closeButton = null;
  if (dialog) {
    messages = dialog.map( (d) => ({type: notificationType.NARRATIVE, ...d}));
    closeButton = {action: "enterChallengeFromRoom"};
  }

  let authoredState = {
    template: templateName,
    challengeType,
    interactionType,
    instructions,
    showUserDrake,
    userChangeableGenes,
    visibleGenes,
    hiddenAlleles,
    baskets,
    gametes,
    drakes,
    trial,
    trials,
    numTrials,
    trialOrder,
    challenges,
    correct: 0,
    errors: 0,
    moves: 0,
    goalMoves,
    userDrakeHidden: true,
    trialSuccess: false,
    initialDrakes: [...drakes],
    zoomUrl,
    location,
    showingRoom,
    notifications: {
      messages,
      closeButton
    }
  };

  // remove all undefined or null keys
  Object.keys(authoredState).forEach((key) => (authoredState[key] == null) && delete authoredState[key]);

  return state.merge(authoredState);
}

export function loadHome(state, authoring, showMissionEndDialog) {
  let room = "home",
      roomInfo = (authoring && authoring.rooms) ? authoring.rooms[room] : {},
      location = {id: room, ...roomInfo},
      { level, mission, started } = AuthoringUtils.getCurrentMissionFromGems(authoring, state.gems),
      dialogDefs = authoring.application.levels[level].missions[mission].dialog,
      messages = [];

  if (dialogDefs) {
    let whichDialog = started ? "middle" : "start",
        dialog = dialogDefs[whichDialog];

    if (!started && showMissionEndDialog) {
      let previousMission = AuthoringUtils.getPreviousMission(authoring, level, mission);
      if (previousMission) {
        let endDialog = authoring.application.levels[previousMission.level].missions[previousMission.mission].dialog["end"] || [];
        dialog = endDialog.concat(dialog);
      }
    }

    messages = dialog.map( (d) => ({type: notificationType.DIALOG, ...d}));
  }

  let authoredState = {
    location,
    showingRoom: true,
    notifications: {
      messages,
      closeButton: false
    }
  };

  // remove all undefined or null keys
  Object.keys(authoredState).forEach((key) => (authoredState[key] == null) && delete authoredState[key]);

  return state.merge(authoredState);
}

export function loadNextTrial(state, authoring) {
  let trial = state.trial;
  if (state.trialSuccess){
    trial = (state.trial < state.numTrials) ? (trial+1) : 0;
  }
  let nextState = state.merge({
    trial: trial
  });

  return  loadStateFromAuthoring(nextState, authoring);
}
