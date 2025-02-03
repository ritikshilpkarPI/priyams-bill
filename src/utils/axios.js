import axios from 'axios';
import { getServerBaseUrl } from './getServerBaseUrl';
const axiosInstance = axios;
const source = axiosInstance.CancelToken.source();
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.baseURL = getServerBaseUrl();

export { source, axiosInstance as Axios };
