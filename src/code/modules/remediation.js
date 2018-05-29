export const GUIDE_REMEDIATION_REQUESTED = "Guide remediation requested";
export const STARTED_REMEDIATION = "Started remediation";
export const ENDED_REMEDIATION = "Ended remediation";

import { GUIDE_MESSAGE_RECEIVED, GUIDE_ALERT_RECEIVED } from './notifications';
import { showNotification } from '../actions';
import actionTypes from '../action-types';
import GeneticsUtils from '../utilities/genetics-utils';

const initialState = false;

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case GUIDE_REMEDIATION_REQUESTED:
      if (action.attribute && action.challengeType) {
        return {
          attribute: action.attribute,
          practiceCriteria: action.practiceCriteria,
          challengeType: action.challengeType
        };
      }
      else
        return initialState;
    case ENDED_REMEDIATION:
      return initialState;
    // otherwise keep the remediation challenge
    default:
      return state;
  }
}

/**
 * action creators
 */

export function requestRemediation(data) {
  return (dispatch, getState) => {
    if (getState().isRemediation) {
      return;
    }

    dispatch({
      type: GUIDE_REMEDIATION_REQUESTED,
      attribute: data.context.attribute,
      practiceCriteria: data.context.practiceCriteria,
      challengeType: data.context.challengeType
    });

    dispatch({
      type: actionTypes.MODAL_DIALOG_SHOWN,
      mouseShieldOnly: true
    });

    let dialog = {
      message: "~ALERT.START_REMEDIATION",
      arrowAsCloseButton: true,
      isInterrupt: true
    };
    dispatch(showNotification(dialog));
  };
}

export function startRemediation() {
  return {
    type: STARTED_REMEDIATION
  };
}

export function endRemediation() {
  return {
    type: ENDED_REMEDIATION
  };
}