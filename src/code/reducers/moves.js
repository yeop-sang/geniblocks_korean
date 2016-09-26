// import Immutable from 'seamless-immutable';
// import { actionTypes } from '../actions';

const initialState = 0;

export default function moves(state = initialState, action) {
  // moves is special, because we don't care about the action type, we
  // just care if incrementMoves is part of the action args
  if (action.incrementMoves) {
    return state + 1;
  }
  return state;
}
