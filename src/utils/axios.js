import axios from "axios";
const axiosInstance = axios;
const source = axiosInstance.CancelToken.source();

if (process.env.ENV_NAME === "staging" || process.env.ENV_NAME === "prod") {
  axiosInstance.defaults.baseURL = "/.netlify/functions/app/";
}
axiosInstance.defaults.withCredentials = true;

export { source, axiosInstance as Axios };
