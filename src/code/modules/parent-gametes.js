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
export const GAMETES_ADDED_TO_POOL = "Gametes added to gamete pool";
export const GAMETE_POOLS_RESET = "Gamete pools reset";
export const GAMETE_SELECTED = "Gamete selected in pool";

/*
  state contains:
    pools: array of two arrays, 0: father's gametes, 1: mother's gametes
    selectedIndices: array of two indices representing the index of
                      the selected gamete (if any) for each parent
 */
const initialState = Immutable({ pools: Immutable([Immutable([]), Immutable([])]),
                                  selectedIndices: Immutable([null, null]) });

/*
 * reducer
 */
export default function reducer(state = initialState, action) {
  let pools, selectedIndices;
  switch (action.type) {
    case GAMETE_POOLS_RESET:
      return initialState;
    case GAMETES_ADDED_TO_POOL:
      pools = state.pools.map((pool, index) => {
                  return index === action.sex
                          ? pool.concat(action.gametes)
                          : pool;
                });
      return state.merge({ pools });
    case GAMETE_SELECTED:
      selectedIndices = state.selectedIndices.map((selectedIndex, index) => {
                                        return (index === action.sex) ? action.index : selectedIndex;
                                      });
      return state.merge({ selectedIndices });
    case actionTypes.GAMETES_RESET:
    case actionTypes.OFFSPRING_KEPT:
      return state.merge({ selectedIndices: Immutable([null, null])});
    default:
      return state;
  }
}

/*
 * selectors
 */
export const fatherGametePool = state => state.pools[0];
export const motherGametePool = state => state.pools[1];
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
export function addGametesToPool(sex, gametes) {
  return {
    type: GAMETES_ADDED_TO_POOL,
    sex,
    gametes: cloneDeep(gametes),
    meta: {
      logTemplateState: true,
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
      logTemplateState: true,
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
    const { parentGametes } = getState(),
          parentPool = parentGametes.pools[sex],
          gamete = index != null ? clone(parentPool[index]) : null;
    dispatch(_selectGameteInPool(sex, index, gamete));
  };
}

export function resetGametePools() {
  return {
    type: GAMETE_POOLS_RESET
  };
}

