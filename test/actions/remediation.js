import expect from 'expect';
import reducer from '../../src/code/reducers/';
import { requestRemediation, GUIDE_REMEDIATION_REQUESTED, ENDED_REMEDIATION } from '../../src/code/modules/remediation';
describe.only('Remediation', () => {

  describe('the action creator', () => {

    describe('when not currently in remediation', () => {
      const dispatch = expect.createSpy();
      const getState = () => ({
        isRemediation: false
      });

      it('should create the remediation action when remediation is requested by the ITS', () => {
        requestRemediation({
          context: {
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleDominant"
          }
        })(dispatch, getState);

        expect(dispatch.calls[0].arguments).toEqual([{
          type: GUIDE_REMEDIATION_REQUESTED,
          challengeType: "Sim",
          attribute: "wings",
          practiceCriteria: "SimpleDominant"
        }]);
      });

      it('should then create the modal click screen action', () => {
        expect(dispatch.calls[1].arguments).toEqual([{
          type: "Modal dialog shown",
          mouseShieldOnly: true
        }]);
      });

      it('should then create the remediation notification action', () => {
        expect(dispatch.calls[2].arguments).toEqual([{
          type: "Notifications shown",
          messages: [
            {
              "text": "~ALERT.START_REMEDIATION"
            }
          ],
          closeButton: {
            action: "startRemediation"
          },
          arrowAsCloseButton: true,
          isInterrupt: true,
          isRaised: false
        }]);
      });

    });

    describe('when in remediation', () => {
      const dispatch = expect.createSpy();
      const getState = () => ({
        isRemediation: true
      });

      it('should not create any actions when remediation is requested by the ITS', () => {

        requestRemediation({
          context: {
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleDominant"
          }
        })(dispatch, getState);

        expect(dispatch.calls.length).toBe(0);
      });
    });
  });

  describe('the reducer', () => {

    let defaultState = reducer(undefined, {});
    let nextState;

    describe('on receiving GUIDE remediation request', () => {

      it('should set the remediation challenge in the state', () => {

        nextState = reducer(defaultState, {
          type: GUIDE_REMEDIATION_REQUESTED,
          challengeType: "Sim",
          attribute: "wings",
          practiceCriteria: "SimpleDominant"
        });

        expect(nextState).toEqual(defaultState.merge({
          remediation: {
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleDominant"
          }
        }));
      });

      describe('and then receiving remediation ended action', () => {

        it('should set the remediation to be false in the state', () => {

          nextState = reducer(defaultState, {
            type: ENDED_REMEDIATION
          });

          expect(nextState).toEqual(defaultState.merge({
            remediation: false
          }));
        });

      });
    });
  });
});
