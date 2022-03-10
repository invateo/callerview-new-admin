import { combineReducers } from 'redux';

export const SWITCH_LOADING = "SWITCH_LOADING";

const initialState = {
  loading: false
};

// eslint-disable-next-line  import/no-anonymous-default-export
const loaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers({
  utility: loaderReducer,
})

