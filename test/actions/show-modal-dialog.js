import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';
import { GUIDE_MESSAGE_RECEIVED } from '../../src/code/modules/notifications';

const types = actions.actionTypes;

describe('showModalDialog action', () => {
  it('should create the correct action', () => {
    expect(actions.showNextTrialButton()).toEqual({
      type: types.MODAL_DIALOG_SHOWN,
      bigButtonText: "~BUTTON.NEXT_TRIAL",
      rightButton: {action: "advanceTrial"},
      showAward: false
    });
  });

  describe('the reducer', () => {
    it('should update the modalDialog when advancing the level', () => {
      let defaultState = reducer(undefined, {});

      let nextState = reducer(defaultState, {
        type: types.MODAL_DIALOG_SHOWN,
        showAward: false,
        bigButtonText: "Next",
        rightButton: {action: "advanceTrial"},
        mouseShieldOnly: false
      });

      expect(nextState).toEqual(defaultState.merge({
        modalDialog: {
          show: true,
          bigButtonText: "Next",
          rightButton: {
            "action": "advanceTrial"
          },
          leftButton: undefined,
          showAward: false,
          mouseShieldOnly: false
        },
        userDrakeHidden: false
      }));
    });

    it('should update the modalDialog correctly for a complete message', () => {
      let defaultState = reducer(undefined, {});

      let nextState = reducer(defaultState, {
        type: types.MODAL_DIALOG_SHOWN,
        rightButton: {
          "action": "action1",
          "label": "Right"
        },
        leftButton: {
          "action": "action2",
          "label": "Left"
        },
        showAward: true,
        mouseShieldOnly: false
      });

      expect(nextState).toEqual(defaultState.merge({
        modalDialog: {
          show: true,
          bigButtonText: undefined,
          rightButton: {
            "action": "action1",
            "label": "Right"
          },
          leftButton: {
            "action": "action2",
            "label": "Left"
          },
          showAward: true,
          mouseShieldOnly: false
        },
        userDrakeHidden: false
      }));
    });

    it('should leave the current modalDialog alone after an ITS message', () => {
      let defaultState = reducer(undefined, {});

      let messageState = reducer(defaultState, {
        type: types.MODAL_DIALOG_SHOWN,
        message: "Message",
        showAward: false
      });

      let nextState = reducer(messageState, {
        type: GUIDE_MESSAGE_RECEIVED,
        state: {
          data: '{"text": "Hi from ITS"}'
        }
      });

      expect(nextState).toEqual(messageState);
    });

    it('should dismiss the modalDialog on a dismiss event', () => {
      let defaultState = reducer(undefined, {}),
          initialState = defaultState.merge({
            modalDialog: {
              show: true,
              rightButton: {
                "action": "action1",
                "label": "Right"
              },
              leftButton: {
                "action": "action2",
                "label": "Left"
              },
              showAward: true,
              mouseShieldOnly: false
            }
          });

      let nextState = reducer(initialState, {
        type: types.MODAL_DIALOG_DISMISSED
      });

      expect(nextState).toEqual(defaultState.merge({
        modalDialog: {
          show: false,
          rightButton: null,
          leftButton: null,
          bigButtonText: null,
          mouseShieldOnly: false
        }
      }));
    });
  });
});
