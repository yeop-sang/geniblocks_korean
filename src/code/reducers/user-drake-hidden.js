import { actionTypes } from '../actions';

const initialState = true;

export default function userDrakeHidden(state = initialState, action) {
  switch (action.type) {
    // Right now the drake is always hidden unless we are displaying a message
    case actionTypes.MODAL_DIALOG_SHOWN:
      return false;
    default:
      return true;
  }
}
