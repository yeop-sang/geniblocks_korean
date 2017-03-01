import expect from 'expect';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('submitEggForBasket action', () => {
  describe('when the egg is submitted correctly', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isCorrect = true,
          submitEggAction = {
                              type: types.EGG_SUBMITTED,
                              eggDrakeIndex,
                              basketIndex,
                              isCorrect,
                              incrementMoves: false,
                              meta: {
                                "itsLog": {
                                  "actor": "USER",
                                  "action": "SUBMITTED",
                                  "target": "EGG"
                                }
                              }
                            };

    const dispatch = expect.createSpy();
    const getState = () => ({routeSpec: {mission: 0, challenge: 0, trial: 0}, trials: [{}], authoring: [[[{}]]]});

    actions.submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect)(dispatch, getState);

    expect(dispatch).toHaveBeenCalled();
    it('should call dispatch with the correct _submitEggForBasket action', () => {
      expect(dispatch.calls[0].arguments).toEqual([submitEggAction]);
    });
  });

  describe('when the egg is submitted incorrectly', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isCorrect = false,
          submitEggAction = {
                              type: types.EGG_SUBMITTED,
                              eggDrakeIndex,
                              basketIndex,
                              isCorrect,
                              incrementMoves: true,
                              meta: {
                                "itsLog": {
                                  "actor": "USER",
                                  "action": "SUBMITTED",
                                  "target": "EGG"
                                }
                              }
                            };

    const dispatch = expect.createSpy();
    const getState = () => ({routeSpec: {mission: 0, challenge: 0, trial: 0}, trials: [{}], authoring: [[[{}]]]});

    actions.submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect)(dispatch, getState);

    expect(dispatch).toHaveBeenCalled();
    it('should call dispatch with the correct _submitEggForBasket action', () => {
      expect(dispatch.calls[0].arguments).toEqual([submitEggAction]);
    });
  });
});
