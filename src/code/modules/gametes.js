/*
  Parent Gametes module

  organized according to the "ducks" principles described at
  https://github.com/erikras/ducks-modular-redux with some ideas taken from
  https://jaysoo.ca/2016/02/28/applying-code-organization-rules-to-concrete-redux-code/
 */
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { clone, cloneDeep } from 'lodash';
import actionTypes from '../action-types';
import { ITS_ACTORS, ITS_ACTIONS, ITS_TARGETS } from '../its-constants';

/*
 * action types
 */
export const GAMETE_CHROMOSOME_ADDED = "Gamete chromosome added";
export const GAMETES_RESET = "Gametes reset";
export const GAMETES_ADDED_TO_POOL = "Gametes added to gamete pool";
export const GAMETE_POOLS_RESET = "Gamete pools reset";
export const GAMETE_SELECTED = "Gamete selected in pool";

/*
  state contains:
    pools: array of two arrays, 0: father's gametes, 1: mother's gametes
    selectedIndices: array of two indices representing the index of
                      the selected gamete (if any) for each parent
 */
export const initialState = Immutable({
                              // the current gametes are represented in the central half-genome views
                              currentGametes: [{}, {}],
                              // the gamete pools for each parent
                              parentPools: [[], []],
                              // the indices of the selected gamete in each pool
                              selectedIndices: [null, null]
                            });

/*
 * reducer
 */
export default function reducer(state = initialState, action) {
  let newState = {}, parentPools;
  switch (action.type) {
    case GAMETE_CHROMOSOME_ADDED:
      return state.setIn(['currentGametes', action.index, action.name], action.side);
    case GAMETE_POOLS_RESET:
      return initialState;
    case GAMETES_ADDED_TO_POOL:
      parentPools = state.parentPools.map((pool, index) => {
                  return index === action.sex
                          ? pool.concat(action.gametes)
                          : pool;
                });
      return state.merge({ parentPools });
    case GAMETE_SELECTED:
      return state.setIn(['currentGametes', action.sex], action.gamete ? clone(action.gamete) : {})
                  .setIn(['selectedIndices', action.sex], action.index);
    case actionTypes.OFFSPRING_KEPT:
      // remove selected gamete from pool after offspring drake is kept
      if (action.interactionType === 'select-gametes') {
        newState.parentPools = state.parentPools.map((pool, poolIndex) => {
                                  return pool.map((gamete, gameteIndex) => {
                                    return gameteIndex === state.selectedIndices[poolIndex]
                                            ? null : gamete;
                                  });
                                });
      }
      if (action.success) {
        newState.currentGametes = initialState.currentGametes;
        newState.selectedIndices = initialState.selectedIndices;
      }
      return state.merge(newState);
    case GAMETES_RESET:
      return state.merge({ currentGametes: initialState.currentGametes,
                          selectedIndices: initialState.selectedIndices});
    default:
      return state;
  }
}

/*
 * selectors
 */
export const fatherCurrentGamete = state => state.currentGametes[0];
export const motherCurrentGamete = state => state.currentGametes[1];
export const fatherGametePool = state => state.parentPools[0];
export const motherGametePool = state => state.parentPools[1];
export const gametePoolSelector = sex => sex ? motherGametePool : fatherGametePool;
export const fatherSelectedGameteIndex = state => state.selectedIndices[0];
export const motherSelectedGameteIndex = state => state.selectedIndices[1];
export const fatherSelectedGamete = createSelector(
                                      fatherGametePool,
                                      fatherSelectedGameteIndex,
                                      (pool, index) => pool[index]);
export const motherSelectedGamete = createSelector(
                                      motherGametePool,
                                      motherSelectedGameteIndex,
                                      (pool, index) => pool[index]);

/*
 * action creators
 */
export function addGameteChromosome(index, name, side) {
  return{
    type: GAMETE_CHROMOSOME_ADDED,
    index,
    name,
    side
  };
}

export function resetGametes() {
  return {
    type: GAMETES_RESET
  };
}

export function addGametesToPool(sex, gametes) {
  return {
    type: GAMETES_ADDED_TO_POOL,
    sex,
    gametes: cloneDeep(gametes),
    meta: {
      itsLog: {
        actor: ITS_ACTORS.SYSTEM,
        action: ITS_ACTIONS.ADDED,
        target: ITS_TARGETS.GAMETE
      }
    }
  };
}

function _selectGameteInPool(sex, index, gamete) {
  return {
    type: GAMETE_SELECTED,
    sex,
    index,
    gamete,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.SELECTED,
        target: ITS_TARGETS.GAMETE
      }
    }
  };
}

export function selectGameteInPool(sex, index) {
  return (dispatch, getState) => {
    const { gametes } = getState(),
          parentPool = gametes.parentPools[sex],
          gamete = index != null ? clone(parentPool[index]) : null;
    dispatch(_selectGameteInPool(sex, index, gamete));
  };
}

export function resetGametePools() {
  return {
    type: GAMETE_POOLS_RESET
  };
}

