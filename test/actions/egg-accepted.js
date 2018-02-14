import expect from 'expect';
import * as actions from '../../src/code/actions';
import reducer from '../../src/code/reducers/';

const types = actions.actionTypes;

describe('acceptEggInBasket action', () => {
  it('should create an action to accept the egg in the basket', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isChallengeComplete = false,
          acceptEggArgs = { eggDrakeIndex, basketIndex, isChallengeComplete },
          acceptEggAction = { type: types.EGG_ACCEPTED, meta: {sound: 'receiveCoin'}, eggDrakeIndex, basketIndex };

    const dispatch = expect.createSpy();

    actions.acceptEggInBasket(acceptEggArgs)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(acceptEggAction);
    expect(dispatch.calls.length).toBe(1);
  });

  it('should create an action to accept the egg in the basket and show completion dialog', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isChallengeComplete = true,
          acceptEggArgs = { eggDrakeIndex, basketIndex, isChallengeComplete },
          acceptEggAction = { type: types.EGG_ACCEPTED, meta: {sound: 'receiveCoin'}, eggDrakeIndex, basketIndex },
          completeChallengeAction = {
                                      type: types.CHALLENGE_COMPLETED,
                                      meta: {sound: 'receiveCoin'}
                                    },
          showInChallengeCompletionMessage = {
            type: types.NOTIFICATIONS_SHOWN,
            messages: [
              {
                text: "~ALERT.COMPLETED_CHALLENGE",
                type: "narrative"
              }
            ],
            closeButton: {
              action: "completeChallenge"
            },
            arrowAsCloseButton: true,
            isRaised: true
          },
          showMouseShield = {
            type: types.MODAL_DIALOG_SHOWN,
            mouseShieldOnly: true
          };

    const dispatch = expect.createSpy();
    const getState = () => ({routeSpec: {level: 0, mission: 0, challenge: 0}, trial: 0, trials: [{}], authoring: {
      challenges: {},
      "application": {"levels": [{"missions": [{"challenges": []}]}]}
    }});

    actions.acceptEggInBasket(acceptEggArgs)(dispatch, getState);
    expect(dispatch.calls[0].arguments).toEqual([acceptEggAction]);
    // must call thunk function ourselves
    dispatch.calls[1].arguments[0](dispatch, getState);
    // // thunk function dispatches the showCompleteChallengeAction
    expect(dispatch.calls[2].arguments).toEqual([completeChallengeAction]);
    expect(dispatch.calls[3].arguments).toEqual([showInChallengeCompletionMessage]);
    expect(dispatch.calls[4].arguments).toEqual([showMouseShield]);
    expect(dispatch.calls.length).toBe(5);
  });

  describe('the reducer', () => {
    it('should make the appropriate changes when passed an EGG_ACCEPTED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState
                          .set("drakes", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: false },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ])
                          .set("baskets", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: false },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ]);


      const eggDrakeIndex = 0, basketIndex = 0,
            acceptEggAction = { type: types.EGG_ACCEPTED, meta: {sound: 'receiveCoin'}, eggDrakeIndex, basketIndex },
            nextState = reducer(initialState, acceptEggAction),
            expectedState = initialState.set("correct", 1)
                                        .setIn(["baskets", 0],
                                              { alleles: "a:T,b:T", sex: 0, eggs: [0], isSelected: false })
                                        .setIn(["drakes", 0],
                                              { alleles: "a:T,b:T", sex: 0, basket: 0, isSelected: false });
      expect(nextState).toEqual(expectedState);
    });
  });
});
