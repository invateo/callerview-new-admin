import { combineReducers } from 'redux';

export const SWITCH_LOADING = "SWITCH_LOADING";
export const STORE_LOGGEDIN_USER = "STORE_LOGGEDIN_USER";

const initialState = {
  loading: false,
  loggedinAdmin: {}
};

// eslint-disable-next-line  import/no-anonymous-default-export
const loaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case STORE_LOGGEDIN_USER:
      return {
        ...state,
        loggedinAdmin: action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers({
  utility: loaderReducer,
})

