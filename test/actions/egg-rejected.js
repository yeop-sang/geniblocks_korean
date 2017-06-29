import expect from 'expect';
import * as actions from '../../src/code/actions';
import reducer from '../../src/code/reducers/';

const types = actions.actionTypes;

describe('rejectEggFromBasket action', () => {
  it('should create an action to reject the egg from the basket', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isChallengeComplete = false,
          rejectEggArgs = { eggDrakeIndex, basketIndex, isChallengeComplete },
          rejectEggAction = { type: types.EGG_REJECTED, eggDrakeIndex, basketIndex };

    const dispatch = expect.createSpy();

    actions.rejectEggFromBasket(rejectEggArgs)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(rejectEggAction);
    expect(dispatch.calls.length).toBe(1);
  });

  it('should create an action to reject the egg from the basket and show completion dialog', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isChallengeComplete = true,
          rejectEggArgs = { eggDrakeIndex, basketIndex, isChallengeComplete },
          rejectEggAction = { type: types.EGG_REJECTED, eggDrakeIndex, basketIndex };

    const dispatch = expect.createSpy();
  const getState = () => ({routeSpec: {level: 0, mission: 0, challenge: 0}, trial: 0, trials: [{}], authoring: {
    challenges: {},
    "application": {"levels": [{"missions": [{"challenges": []}]}]}
  }});

    actions.rejectEggFromBasket(rejectEggArgs)(dispatch, getState);
    expect(dispatch.calls[0].arguments).toEqual([rejectEggAction]);
    expect(dispatch.calls.length).toBe(1);
  });

  describe('the reducer', () => {
    it('should make the appropriate changes when passed an EGG_REJECTED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: false },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ]);

      const eggDrakeIndex = 0, basketIndex = 0,
            rejectEggAction = { type: types.EGG_REJECTED, eggDrakeIndex, basketIndex },
            nextState = reducer(initialState, rejectEggAction),
            expectedState = initialState.merge({
                                          errors:1,
                                          challengeErrors: 1
                                        })
                                        .setIn(["drakes", 0],
                                              { alleles: "a:T,b:T", sex: 0, basket: -1, isSelected: false });
      expect(nextState).toEqual(expectedState);
    });
  });
});
