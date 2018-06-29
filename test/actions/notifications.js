import expect from 'expect';
import reducer from '../../src/code/reducers/';
import { startSession } from '../../src/code/actions';
import { ADVANCE_NOTIFICATIONS, GUIDE_HINT_RECEIVED } from '../../src/code/modules/notifications';
import urlParams from '../../src/code/utilities/url-params';
import actionTypes from '../../src/code/action-types';

describe('Notification actions', () => {

  before( () => urlParams.showITS = "true" );

  after( () => delete urlParams.showITS );

  describe('the reducer', () => {

    let defaultState = reducer(undefined, {});
    let nextState;

    let itsData = {
      context: {
        hintDialog: "Ok! Let's get to work on Mission 0 Challenge 2."
      }
    };

    // TODO: Re-enable these tests once ITS is working!

    describe('on receiving GUIDE message', () => {

      it('should add to the notifications', () => {

        nextState = reducer(defaultState, {
          type: GUIDE_HINT_RECEIVED,
          data: itsData
        });

        expect(nextState).toEqual(defaultState.merge({
          notifications: {
            messages: [{
              text: "Ok! Let's get to work on Mission 0 Challenge 2."
            }],
            closeButton: null
          }
        }));
      });

      it('should concatenate the notifications', () => {

        let secondMessageData = {
          context: {
            hintDialog: "Second message."
          }
        };

        let lastState = reducer(nextState, {
          type: GUIDE_HINT_RECEIVED,
          data: secondMessageData
        });

        expect(lastState).toEqual(defaultState.merge({
          notifications: {
            messages: [{
              text: "Ok! Let's get to work on Mission 0 Challenge 2. Second message."
            }],
            closeButton: null
          }
        }));
      });

      it('should append a trait to the message if there is one', () => {

        const traitMessage = {
          context: {
            hintDialog: "This is a message about legs.",
            attribute: "hindlimbs"
          }
        };

        nextState = reducer(defaultState, {
          type: GUIDE_HINT_RECEIVED,
          data: traitMessage
        });

        expect(nextState).toEqual(defaultState.merge({
          notifications: {
            messages: [{
              text: "This is a message about legs.",
              "trait": "hindlimbs"
            }],
            closeButton: null
          }
        }));
      });
    });

    describe('on receiving modal dialog messages', () => {

      it('should add to the notifications with the correct close button action', () => {

        nextState = reducer(defaultState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "Sample message"}],
          showAward: false,
          closeButton: "sampleAction"
        });

        expect(nextState.notifications.messages).toEqual([{text: "Sample message"}]);
        expect(nextState.notifications.closeButton).toEqual("sampleAction");
      });

      it('should be correctly translated', () => {

        nextState = reducer(defaultState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "~ALERT.COMPLETED_CHALLENGE"}]
        });

        expect(nextState.notifications.messages).toEqual([{text: "Challenge completed!"}]);
      });

      it('should be correctly concatenate multiple messages', () => {

        nextState = reducer(defaultState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "Message 1"}],
          showAward: false,
          closeButton: "sampleAction"
        });

        nextState = reducer(nextState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "Message 2"}]
        });

        expect(nextState.notifications.messages).toEqual([
          {text: "Message 1"},
          {text: "Message 2"}
        ]);
      });

      it('should swap messages if interrupted', () => {

        nextState = reducer(defaultState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "Message 1"}]
        });

        nextState = reducer(nextState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "Message 2"}],
          isInterrupt: true
        });

        expect(nextState.notifications.messages).toEqual([
          {text: "Message 2"}
        ]);
      });

      it('should advance through messages', () => {

        nextState = reducer(defaultState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "Message 1"}],
          showAward: false,
          closeButton: "sampleAction"
        });

        nextState = reducer(nextState, {
          type: actionTypes.NOTIFICATIONS_SHOWN,
          messages: [{text: "Message 2"}],
          showAward: false,
          closeButton: "sampleAction"
        });

        expect(nextState.notifications.messages).toEqual([
          {text: "Message 1"},
          {text: "Message 2"}
        ]);

        nextState = reducer(nextState, {
          type: ADVANCE_NOTIFICATIONS
        });

        expect(nextState.notifications.messages).toEqual([
          {text: "Message 2"}
        ]);
      });
    });

    describe('on receiving other actions', () => {

      nextState = reducer(defaultState, {
        type: GUIDE_HINT_RECEIVED,
        data: itsData
      });

      it('should clear the notifications', () => {
        let lastState = reducer(nextState, startSession("123"));

        expect(lastState).toEqual(defaultState.merge({
          notifications: {messages: [], closeButton: null}
        }));
      });
    });
  });
});
