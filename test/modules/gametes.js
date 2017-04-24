import expect from 'expect';
import reducer, { initialState,
      GAMETE_CHROMOSOME_ADDED, addGameteChromosome,
      GAMETES_ADDED_TO_POOL, addGametesToPool,
      GAMETE_SELECTED, selectGameteInPool,
      GAMETES_RESET, resetGametes,
      GAMETE_POOLS_RESET, resetGametePools } from '../../src/code/modules/gametes';
import { ITS_ACTORS, ITS_TARGETS, ITS_ACTIONS } from '../../src/code/its-constants';

describe("gametes module", () => {

  describe("addGameteChromosome action", () => {
    it("should create an action to add a chromosome to one of the current gametes", () => {
      expect(addGameteChromosome(1, '2', 'b')).toEqual({
        type: GAMETE_CHROMOSOME_ADDED,
        index: 1,
        name: '2',
        side: 'b'
      });
    });
  });

  describe("reducer", () => {
    it("should handle addGameteChromosome action appropriately", () => {
      const state = initialState,
            action = addGameteChromosome(1, '2', 'b');
      expect(reducer(state, action)).toEqual(initialState.merge({
        currentGametes: [{}, { '2': 'b' }]
      }));
    });
  });

  describe("addGametesToPool action", () => {
    it("should create an action to add gametes to one of the gamete pools", () => {
      const gametes = [ { '1': 'a', '2': 'a', 'XY': 'x' },
                        { '1': 'b', '2': 'b', 'XY': 'y' }];
      expect(addGametesToPool(0, gametes)).toEqual({
        type: GAMETES_ADDED_TO_POOL,
        sex: 0,
        gametes: gametes,
        meta: {
          itsLog: {
            actor: ITS_ACTORS.SYSTEM,
            action: ITS_ACTIONS.ADDED,
            target: ITS_TARGETS.GAMETE
          }
        }
      });
    });
  });

  let state = initialState;

  describe("reducer", () => {
    it("should handle addGametesToPool action appropriately", () => {
      const gametes = [ { '1': 'a', '2': 'a', 'XY': 'x' },
                        { '1': 'b', '2': 'b', 'XY': 'y' }],
            action = addGametesToPool(0, gametes);
      state = reducer(state, action);
      expect(state).toEqual(initialState.merge({
        parentPools: [[ { '1': 'a', '2': 'a', 'XY': 'x' },
                        { '1': 'b', '2': 'b', 'XY': 'y' } ], []]
      }), "should add the new gametes to the appropriate pool");
      expect(state.parentPools[0]).toNotBe(gametes, "should not reuse the client-provided array");
    });
  });

  describe("reducer", () => {
    it("should handle selectGameteInPool action appropriately", () => {
      const getState = () => ({ gametes: state }),
            dispatch = expect.createSpy(),
            prevState = state,
            action = {
              type: GAMETE_SELECTED,
              sex: 0,
              index: 1,
              gamete: { '1': 'b', '2': 'b', 'XY': 'y' },
              meta: {
                itsLog: {
                  actor: ITS_ACTORS.USER,
                  action: ITS_ACTIONS.SELECTED,
                  target: ITS_TARGETS.GAMETE
                }
              }
            };

      selectGameteInPool(0, 1)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(action);

      state = reducer(state, action);
      expect(state).toEqual(prevState.merge({
        currentGametes: [{ '1': 'b', '2': 'b', 'XY': 'y' }, {}],
        selectedIndices: [1, null]
      }));
    });
  });

  describe("resetGametes action", () => {
    it("should create an action to reset the gametes", () => {
      expect(resetGametes()).toEqual({
        type: GAMETES_RESET,
        incrementMoves: false
      });
    });
  });

  describe("reducer", () => {
    it("should handle resetGametes action appropriately", () => {
      const action = resetGametes(),
            newState = reducer(state, action);
      expect(newState).toEqual(state.merge({ currentGametes: initialState.currentGametes,
                                            selectedIndices: initialState.selectedIndices }));
    });
  });

  describe("resetGametePools action", () => {
    it("should create an action to reset the gamete pools", () => {
      expect(resetGametePools()).toEqual({
        type: GAMETE_POOLS_RESET
      });
    });
  });

  describe("reducer", () => {
    it("should handle resetGametePools action appropriately", () => {
      const action = resetGametePools(),
            newState = reducer(state, action);
      expect(newState).toEqual(initialState);
    });
  });

});
