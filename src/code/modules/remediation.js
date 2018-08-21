export const GUIDE_REMEDIATION_REQUESTED = "Guide remediation requested";
export const STARTED_REMEDIATION = "Started remediation";
export const ENDED_REMEDIATION = "Ended remediation";

import { showNotification } from '../actions';
import actionTypes from '../action-types';
import GeneticsUtils from '../utilities/genetics-utils';

/**
 *  reducers
 */

 // *** remediation reducer ***
const initialRemediationState = false;

export function remediation(state = initialRemediationState, action) {
  switch (action.type) {
    case GUIDE_REMEDIATION_REQUESTED:
      if (action.attribute && action.challengeType) {
        return {
          attribute: action.attribute,
          practiceCriteria: action.practiceCriteria,
          challengeType: action.challengeType
        };
      }
      else
        return initialRemediationState;
    case ENDED_REMEDIATION:
      return initialRemediationState;
    // otherwise keep the remediation challenge
    default:
      return state;
  }
}

//  *** remediationHistory reducer ***
const initialHistoryState = [];

export function remediationHistory(state = initialHistoryState, routeSpec, action) {
  switch(action.type) {
    case STARTED_REMEDIATION: {
        if (!routeSpec) return state;

        let { level: currLevel, mission: currMission, challenge: currChallenge } = routeSpec;

        // ensure all challenges leading up to this are a real value or 0
        for (let level = 0; level <= currLevel; level++) {
          if (!state[level]) {
            state = state.setIn([level], []);
          }
        }
        for (let mission = 0; mission <= currMission; mission++) {
          if (!state[currLevel][mission]) {
            state = state.setIn([currLevel, mission], []);
          }
        }
        for (let challenge = 0; challenge <= currChallenge; challenge++) {
          if (!(state[currLevel][currMission][challenge])) {
            state = state.setIn([currLevel, currMission, challenge], 0);
          }
        }

        let previous = state[currLevel][currMission][currChallenge];

        state = state.setIn([currLevel, currMission, currChallenge], previous + 1);

        return state;
      }
    case actionTypes.LOAD_SAVED_STATE: {
      if (action.state && action.state.remediationHistory) {
        return action.state.remediationHistory;
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}


/**
 * action creators
 */

export function requestRemediation(data) {
  return (dispatch, getState) => {
    if (getState().isRemediation) {
      return;
    }

    dispatch({
      type: GUIDE_REMEDIATION_REQUESTED,
      attribute: data.context.attribute,
      practiceCriteria: data.context.practiceCriteria,
      challengeType: data.context.challengeType
    });

    dispatch({
      type: actionTypes.MODAL_DIALOG_SHOWN,
      mouseShieldOnly: true
    });

    let dialog = {
      message: "~ALERT.START_REMEDIATION",
      closeButton: {
        action: "startRemediation"
      },
      arrowAsCloseButton: true,
      isInterrupt: true
    };
    dispatch(showNotification(dialog));
  };
}

export function startRemediation() {
  return {
    type: STARTED_REMEDIATION
  };
}

export function endRemediation() {
  return {
    type: ENDED_REMEDIATION
  };
}

/**
 * challenge-specific remediation authoring
 */

function getMatchDrakeRemediation(trait, practiceCriteria) {
  const templateName = "FVGenomeChallenge";

  let baseAlleles = "a:W,b:W,a:M,b:M,a:T,b:T,a:H,b:H,a:Hl,b:Hl,a:Fl,b:Fl,a:A1,b:A1,a:C,b:C,a:b,b:b,a:d,b:d,a:rh,b:rh,a:Bog,b:Bog";
  baseAlleles = baseAlleles.replace(GeneticsUtils.getAllelesForTrait(trait, "dominant"), "");
  let userAlleles, targetAlleles;
  switch(trait) {
    case 'sex':
      userAlleles   = "";
      targetAlleles = "";
      break;
    default:
      if (practiceCriteria === "SimpleDominant") {
        userAlleles   = GeneticsUtils.getAllelesForTrait(trait, "recessive");
        targetAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      } else {
        userAlleles   = GeneticsUtils.getAllelesForTrait(trait, "dominant");
        targetAlleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
      }
  }

  let userSex, targetSex;
  switch(trait) {
    case 'sex':
      userSex = Math.round(Math.random());
      targetSex = 1 - userSex;
      break;
    default:
      userSex = targetSex = Math.round(Math.random());
  }

  const authoring = {
    "challengeType" : "match-target",
    "initialDrake" : [ {
      "alleles" : `${userAlleles},${baseAlleles}`,     // earlier alleles overwrite later ones
      "sex" : userSex
    } ],
    "targetDrakes" : [ {
      "alleles" : `${targetAlleles},${baseAlleles}`,
      "sex" : targetSex
    } ]
  };

  return {
    authoring,
    templateName,
    stateProps: {
      userChangeableGenes: [trait],
      showUserDrake: true,
      visibleGenes: [],
      hiddenAlleles: ['Tk', 'A2'],
      numTargets: 1,
      numTrials: 1,
      trial: 0,
      goalMoves: -1,
      room: "simroom"
    }
  };
}

function getEggSortRemediation(trait, /* practiceCriteria */) {
  const templateName = "FVEggSortGame";

  let dominantLabel, recessiveLabel;

  if (trait === "horns") {
    dominantLabel = "Drakes without horns";
    recessiveLabel = "Drakes with horns";
  } else {
    dominantLabel = `Drakes with ${GeneticsUtils.commonName(trait)}`;
    recessiveLabel = `Drakes without ${GeneticsUtils.commonName(trait)}`;
  }

  let baskets;
  switch(trait) {
    case 'sex':
      baskets = [{
        "alleles" : [ "" ],
        "label" : "Males",
        "sex" : 0
      }, {
        "alleles" : [ "" ],
        "label" : "Females",
        "sex" : 1
      }];
      break;
    default:
      baskets = [{
        "alleles" : [ `a:${GeneticsUtils.dominant(trait)}`, `b:${GeneticsUtils.dominant(trait)}` ],
        "label" : dominantLabel,
        "sex" : 1
      }, {
        "alleles" : [ GeneticsUtils.getAllelesForTrait(trait, "recessive") ],
        "label" : recessiveLabel,
        "sex" : 1
      }];
  }

  let baseAlleles = "a:W,b:W,a:M,b:M,a:T,b:T,a:H,b:H,a:Hl,b:Hl,a:Fl,b:Fl,a:A1,b:A1,a:C,b:C,a:b,b:b,a:d,b:d,a:rh,b:rh,a:Bog,b:Bog";
  baseAlleles = baseAlleles.replace(GeneticsUtils.getAllelesForTrait(trait, "dominant"), "");

  let trialGenerator = {
    baseDrake: baseAlleles,
    type: "randomize-order"
  };
  switch(trait) {
    case 'sex':
      trialGenerator.drakes = [
        {
          "alleles" : "",
          "sex" : 0
        },
        {
          "alleles" : "",
          "sex" : 0
        },
        {
          "alleles" : "",
          "sex" : 1
        },
        {
          "alleles" : "",
          "sex" : 1
        }
      ];
      break;
    default:
      trialGenerator.drakes = [
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "dominant"),
          "sex" : 1
        },
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "recessive"),
          "sex" : 1
        },
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "heterozygous"),
          "sex" : 1
        },
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "heterozygous"),
          "sex" : 1
        }
      ];
  }

  const authoring = {
    baskets,
    trialGenerator
  };

  return {
    authoring,
    templateName,
    stateProps: {
      userChangeableGenes: [trait],
      numTrials: 1,
      trial: 0,
      goalMoves: -1,
      room: "hatchery"
    }
  };
}

export function getRemediationChallengeProps(challengeType, trait, practiceCriteria) {
  let challengeProps;
  if (challengeType === "Sim") {
    challengeProps = getMatchDrakeRemediation(trait, practiceCriteria);
  } else if (challengeType === "Hatchery") {
    challengeProps = getEggSortRemediation(trait, practiceCriteria);
  }

  if (!challengeProps) {
    return;
  }

  // state props common to all remediation challenges
  const commonStateProps = {
    isRemediation: true,
    correct: 0,
    errors: 0,
    moves: 0,
    userDrakeHidden: true,
    trialSuccess: false,
    showingRoom: false,
    notifications: {
      messages: [{
        text: ["~REMEDIATION.START_SIM", GeneticsUtils.commonName(trait)]
      }],
      closeButton: true
    }
  };

  // merge the state properties that are challenge-specific and common together
  challengeProps.stateProps = {
    ...challengeProps.stateProps,
    ...commonStateProps
  };

  return challengeProps;
 }