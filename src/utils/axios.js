import axios from "axios";
const axiosInstance = axios;
const source = axiosInstance.CancelToken.source();

if (
  process.env.ENV_NAME === "staging" ||
  process.env.NODE_ENV === "staging" ||
  process.env.ENV_NAME === "prod" ||
  process.env.NODE_ENV === "prod"
) {
  axiosInstance.defaults.baseURL = "/.netlify/functions/app/";
}

export { source, axiosInstance as Axios };
