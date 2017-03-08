import expect from 'expect';
import reducer from '../../src/code/reducers/';
import * as actions from '../../src/code/actions';
import urlParams from '../../src/code/utilities/url-params';
import GuideProtocol from '../../src/code/utilities/guide-protocol';

const types = actions.actionTypes;

describe('Notification actions', () => {

  before( () => urlParams.showITS = "true" );

  after( () => delete urlParams.showITS );

  describe('the reducer', () => {

    let defaultState = reducer(undefined, {});
    let nextState;

      let messageData = JSON.stringify(
        {
          message: {
            id: 'ITS.CHALLENGE.INTRO.2',
            text: 'Ok! Let\'s get to work on Mission {{mission}} Challenge {{challenge}}.',
            args: {
              level: 0,
              mission: 0,
              challenge: 2
            }
          },
          time: 1484069330265
        }
      );

    describe('on receiving GUIDE message', () => {

      it('should add to the notifications', () => {

        nextState = reducer(defaultState, {
          type: types.GUIDE_MESSAGE_RECEIVED,
          data: GuideProtocol.TutorDialog.fromJson(messageData)
        });

        expect(nextState).toEqual(defaultState.merge({
          notifications: ["Ok! Let's get to work on Mission 0 Challenge 2."]
        }));
      });

      it('should keep adding to the notifications', () => {

        let secondMessageData = JSON.stringify(
          {
            message: {
              id: 'ITS.CHALLENGE.INTRO.3',
              text: 'Second message.',
              args: {}
            },
            time: 1484069330265
          }
        );

        let lastState = reducer(nextState, {
          type: types.GUIDE_MESSAGE_RECEIVED,
          data: GuideProtocol.TutorDialog.fromJson(secondMessageData)
        });

        expect(lastState).toEqual(defaultState.merge({
          notifications: ["Ok! Let's get to work on Mission 0 Challenge 2.", "Second message."]
        }));
      });
    });

    describe('on receiving other actions', () => {

      nextState = reducer(defaultState, {
        type: types.GUIDE_MESSAGE_RECEIVED,
        data: GuideProtocol.TutorDialog.fromJson(messageData)
      });

      it('should clear the notifications', () => {
        let lastState = reducer(nextState, actions.startSession("123"));

        expect(lastState).toEqual(defaultState.merge({
          notifications: []
        }));
      });
    });
  });
});
