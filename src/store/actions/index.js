import { STORE_LOGGEDIN_USER, SWITCH_LOADING } from "../reducers";
import { toast } from "react-toastify";
import AxiosInstance from "../../config/axios";

export const switchLoading = (payload) => (dispatch) => {
  return dispatch({
    type: SWITCH_LOADING,
    payload,
  });
};
const storeLoggedinUser = (payload) => (dispatch) => {
  return dispatch({
    type: STORE_LOGGEDIN_USER,
    payload,
  });
};

export const getLoggedinUser = () => (dispatch) => {
  dispatch(switchLoading(true));
  AxiosInstance.get("/admin").then((res) => {
    dispatch(switchLoading(false));
    dispatch(storeLoggedinUser({
      email: res.data.data.admin.email, 
      privileges: res.data.data.privilege?.name
    }));
  })
  .catch((err) => {
    dispatch(switchLoading(false));
    toast.error(
      err?.response?.data?.message ?? "An unknown error occured."
    );
  });
}
