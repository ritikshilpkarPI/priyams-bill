import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getServerBaseUrl } from "../utils/getServerBaseUrl";

const apiClient: AxiosInstance = axios.create({
  baseURL: getServerBaseUrl(),
  timeout: 30000,
  headers: {
    common: {
      'Content-Type': 'application/json',
    }
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
    const storedLocation = JSON.parse(localStorage.getItem('storeLocation') || '{}');
    const params = {
      ...storedLocation,
    };
    const config: AxiosRequestConfig = {
      method,
      url: path,
      data,
      headers: getHeaders(headers),
      params
    };
    const response: AxiosResponse<R> = await apiClient(config);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    throw error.response?.data || error.message;
  }
};