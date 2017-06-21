import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import { loadStateFromAuthoring, loadNextTrial } from './helpers/load-state-from-authoring';
import urlParams from '../utilities/url-params';

// reducers
import routing from './routing';
import moves from './moves';
import modalDialog from './modal-dialog';
import userDrakeHidden from './user-drake-hidden';
import gametes from '../modules/gametes';
import drakes from './drakes';
import baskets from './baskets';
import notifications from '../modules/notifications';
import trialSuccess from './trial-success';
import currentGem from './current-gem';
import gems from './gems';

function initialState() {
  return Immutable({
            template: null,
            userChangeableGenes: [],
            visibleGenes: [],
            hiddenAlleles: [],
            trial: 0,
            routeSpec: null,
            challenges: 1,
            errors: 0,
            correct: 0,
            currentGem: 0,
            gems: [],
            authoring: window.GV2Authoring,
            endMissionUrl: urlParams.start
          });
}

export default function reducer(state, action) {
  if (!state) state = initialState();

  state = state.merge({
    routing: routing(state.routing, action),
    moves: moves(state.moves, action),
    modalDialog: modalDialog(state.modalDialog, action),
    userDrakeHidden: userDrakeHidden(state.userDrakeHidden, action),
    gametes: gametes(state.gametes, action),
    drakes: drakes(state.drakes, state.gametes, action),
    baskets: baskets(state.baskets, action),
    notifications: notifications(state.notifications, action),
    trialSuccess: trialSuccess(state.trialSuccess, action)
  });

  // these reducers act on the state that has already been changed by the
  // above reducers
  state = state.merge({
    currentGem: currentGem(state.currentGem, state.moves, state.goalMoves, action)
  });
  state = state.merge({
    gems: gems(state.gems, state.currentGem, state.routeSpec, action)
  });

  switch(action.type) {
    case actionTypes.AUTHORING_CHANGED:
      return state.set('authoring', action.authoring);

    case actionTypes.EGG_REJECTED: {
      return state.merge({
        errors: state.errors + 1
      });
    }
    case actionTypes.EGG_ACCEPTED: {
      return state.merge({
        correct: state.correct + 1
      });
    }

    case actionTypes.ADVANCED_TRIAL: {
      if (state.trialSuccess){
        if (state.trial < state.numTrials - 1) {
          return loadNextTrial(state, action.authoring);
        }
      }
      return state;
    }
    case actionTypes.NAVIGATED: {
      //TODO: it would be nice to merge this with the "routing" reducer into a module which controls the state's routeSpec
      const { level, mission, challenge } = action;
      state = state.merge({
        routeSpec: {level, mission, challenge},
        trial: 0
      });
      return loadStateFromAuthoring(state, state.authoring);
    }
    case actionTypes.NAVIGATED_PAGE:
      window.location = action.url;
      return state;

    default:
      return state;
  }
}
