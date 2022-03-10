import { SWITCH_LOADING } from "../reducers";

export const switchLoading = (payload) => (dispatch) => {
  return dispatch({
    type: SWITCH_LOADING,
    payload,
  });
};
