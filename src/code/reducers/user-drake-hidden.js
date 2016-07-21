import { actionTypes } from '../actions';

const initialState = true;

export default function modalDialog(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MODAL_DIALOG_SHOWN:
      return false;
    default:
      return true;
  }
}
