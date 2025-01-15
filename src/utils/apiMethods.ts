import { apiCall } from '../configs/axiosConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAPI = async <R = any>(
  params: Omit<ApiCallParams, 'method' | 'data'>
): Promise<R> => apiCall({ ...params, method: 'GET' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postAPI = async <T = any, R = any>(
  params: Omit<ApiCallParams<T>, 'method'>
): Promise<R> => apiCall({ ...params, method: 'POST' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const putAPI = async <T = any, R = any>(
  params: Omit<ApiCallParams<T>, 'method'>
): Promise<R> => apiCall({ ...params, method: 'PUT' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const patchAPI = async <T = any, R = any>(
  params: Omit<ApiCallParams<T>, 'method'>
): Promise<R> => apiCall({ ...params, method: 'PATCH' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteAPI = async <R = any>(
  params: Omit<ApiCallParams, 'method' | 'data'>
): Promise<R> => apiCall({ ...params, method: 'DELETE' });