import expect from 'expect';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('startSession action', () => {
  const dispatch = expect.createSpy(),
        uuid = '123';

  actions.startSession(uuid)(dispatch);
  it('should create an action to start a session', () => {
    var startSessionAction = dispatch.calls[0].arguments[0];
    expect(startSessionAction).toEqual({
      type: types.SESSION_STARTED,
      session: uuid,
      itsDBEndpoint: null,
      meta: {
        "dontLog": [
          "session"
        ],
        "itsLog": {
          "actor": "SYSTEM",
          "action": "STARTED",
          "target": "SESSION"
        }
      }
    });
  });
});
