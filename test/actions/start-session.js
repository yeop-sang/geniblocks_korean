import expect from 'expect';
import * as actions from '../../src/code/actions';

const types = actions.actionTypes;

describe('startSession', () => {
  it('should create an action to start a session', () => {
    const uuid = '123';
    expect(actions.startSession(uuid)).toEqual({
      type: types.SESSION_STARTED,
      session: uuid
    });
  });
});
