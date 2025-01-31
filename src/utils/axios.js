import axios from 'axios';
const axiosInstance = axios;
const source = axiosInstance.CancelToken.source();
axiosInstance.defaults.withCredentials = true;

if (
  process.env.ENV_NAME === 'staging' ||
  process.env.NODE_ENV === 'staging' ||
  process.env.ENV_NAME === 'production' ||
  process.env.NODE_ENV === 'production'
) {
  axiosInstance.defaults.baseURL = '/.netlify/functions/server/';
}

export { source, axiosInstance as Axios };
