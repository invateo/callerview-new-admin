import axios from "axios";
function gettoken() {
  let token = localStorage.getItem("CallerView-XXX") ?? null;
  return token;
}
let AxiosInstance = axios.create({
  baseURL: "https://video-ringtone.herokuapp.com/api"
});

AxiosInstance.defaults.headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  Accept: "application/json",
  //    "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
};

AxiosInstance.interceptors.request.use(function (config) {
  if (gettoken()) {
    config.headers.Authorization = `Bearer ${gettoken()}`;
  }
  return config;
});
export default AxiosInstance;
