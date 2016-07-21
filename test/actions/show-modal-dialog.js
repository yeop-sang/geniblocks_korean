import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('showModalDialog action', () => {
  it('should create the correct action', () => {
    let message = "Message",
        explanation = "Body",
        rightButton = {label: "Right"},
        leftButton = {label: "Left"};

    let actionObject = actions.showModalDialog({
      message,
      explanation,
      rightButton,
      leftButton
    });

    expect(actionObject).toEqual({
      type: types.MODAL_DIALOG_SHOWN,
      message,
      explanation,
      leftButton,
      rightButton,
      showAward: false,
      top: undefined
    });
  });

  describe('the reducer', () => {
    it('should update the modalDialog correctly for a minimal message', () => {
      let defaultState = reducer(undefined, {});

      let nextState = reducer(defaultState, {
        type: types.MODAL_DIALOG_SHOWN,
        message: "Message",
        showAward: false
      });

      expect(nextState).toEqual(defaultState.merge({
        modalDialog: {
          show: true,
          message: "Message",
          explanation: undefined,
          rightButton: {
            "action": "dismissModalDialog",
            "label": "~BUTTON.OK"
          },
          leftButton: undefined,
          showAward: false,
          top: undefined
        },
        userDrakeHidden: false
      }));
    });

    it('should update the modalDialog correctly for a complete message', () => {
      let defaultState = reducer(undefined, {});

      let nextState = reducer(defaultState, {
        type: types.MODAL_DIALOG_SHOWN,
        message: "Message",
        explanation: "Body",
        rightButton: {
          "action": "action1",
          "label": "Right"
        },
        leftButton: {
          "action": "action2",
          "label": "Left"
        },
        showAward: true,
        top: "50px"
      });

      expect(nextState).toEqual(defaultState.merge({
        modalDialog: {
          show: true,
          message: "Message",
          explanation: "Body",
          rightButton: {
            "action": "action1",
            "label": "Right"
          },
          leftButton: {
            "action": "action2",
            "label": "Left"
          },
          showAward: true,
          top: "50px"
        },
        userDrakeHidden: false
      }));
    });

    it('should update the modalDialog correctly for an ITS message', () => {
      let defaultState = reducer(undefined, {});

      let nextState = reducer(defaultState, {
        type: types.SOCKET_RECEIVED,
        state: {
          data: '{"text": "Hi from ITS"}'
        }
      });

      expect(nextState).toEqual(defaultState.merge({
        modalDialog: {
          show: true,
          message: "Message from ITS",
          explanation: "Hi from ITS",
          rightButton: {
            "action": "dismissModalDialog",
            "label": "~BUTTON.OK"
          },
          leftButton: null
        }
      }));
    });

    it('should dismiss the modalDialog on a dismiss event', () => {
      let defaultState = reducer(undefined, {}),
          initialState = defaultState.merge({
            modalDialog: {
              show: true,
              message: "Message",
              explanation: "Body",
              rightButton: {
                "action": "action1",
                "label": "Right"
              },
              leftButton: {
                "action": "action2",
                "label": "Left"
              },
              showAward: true,
              top: "50px"
            }
          });

      let nextState = reducer(initialState, {
        type: types.MODAL_DIALOG_DISMISSED
      });

      expect(nextState).toEqual(defaultState.merge({
        modalDialog: {
          show: false,
          message: null,
          explanation: null,
          rightButton: null,
          leftButton: null
        }
      }));
    });
  });
});
