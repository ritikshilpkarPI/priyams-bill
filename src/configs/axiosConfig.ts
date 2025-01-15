import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CLIENT_ENVIRONMENT } from '../utils/constants/clientEnvironment';

const apiClient: AxiosInstance = axios.create({
  baseURL: CLIENT_ENVIRONMENT.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getHeaders = (
  headers: Record<string, string> = {}
): Record<string, string> => {
  const defaultHeaders: Record<string, string> = Object.fromEntries(
    Object.entries(apiClient.defaults.headers.common).map(([key, value]) => [
      key,
      value?.toString() || '',
    ])
  );
  return {
    ...defaultHeaders,
    ...headers,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiCall = async <T = any, R = any>({
  method,
  path,
  data,
  headers,
}: ApiCallParams<T>): Promise<R> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: path,
      data,
      headers: getHeaders(headers),
    };
    const response: AxiosResponse<R> = await apiClient(config);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    throw error.response?.data || error.message;
  }
};