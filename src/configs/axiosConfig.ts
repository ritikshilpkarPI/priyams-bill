import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getServerBaseUrl } from "../utils/getServerBaseUrl";

const apiClient: AxiosInstance = axios.create({
  baseURL: getServerBaseUrl(),
  timeout: 30000,
  headers: {
    common: {
      'Content-Type': 'application/json',
      'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDZjZjFiOTgzZTg1YmZiOTNlNTg4ZCIsIm5hbWUiOiJUZXN0IEFkbWluIiwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJ0ZXN0X2FkbWluIiwiaWF0IjoxNzM5NTk2NTU2LCJleHAiOjE3NDIxODg1NTZ9.9mOY7RXYioi-9zmVyZZM6ZQxOfwL0J0K7XT6n74NkLs'
    },
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