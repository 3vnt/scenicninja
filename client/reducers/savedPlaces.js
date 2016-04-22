import * as types from '../constants/ActionTypes.js';

const initialState = [];

export default function places (state = initialState, action) {
  console.log('Action: ', action);
  console.log('State: ', state);

  switch (action.type) {
    case types.SAVE_PLACE:
      for (var i = 0; i < state.length; i++) {
        if (state[i].googlePlaceId === action.place.googlePlaceId) {
          return state;
        }
      }
      return state.concat(action.place);
    case types.DELETE_PLACE:
      var newState = state.slice();
      for (var i = 0; i < newState.length; i++) {
        if (newState[i].googlePlaceId === action.placeId) {
          newState.splice(i, 1);
        }
      }
      // console.log(newState);
      return newState;
    default:
      return state;
  }
}
