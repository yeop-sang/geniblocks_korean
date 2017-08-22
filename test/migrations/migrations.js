import expect from 'expect';
import migrate from '../../src/code/migrations';

describe("migrations", () => {
  it("should set version number to most recent", () => {
    let state = {gems: []},
        nextState = migrate(state);
    expect(nextState.stateVersion).toEqual(2);
  });

  it("should migrate gems to version 2", () => {
    let state = {gems: [[[0]],[[1,2],[0,0]]]},
        nextState = migrate(state);
    expect(nextState.gems).toEqual([[[[0]]],[[[1],[2]],[[0],[0]]]]);
  });
});
