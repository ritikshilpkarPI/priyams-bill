import { Axios } from './axios';
export const genericAxios = async ({
  url = '',
  params = {},
  method = 'get',
  data = {},
  headers = {
    Cookie: '',
  },
}) => {
  try {
    const storedLocation = JSON.parse(localStorage.getItem('location') || '{}');
    const updatedParams = {
      ...params,
      ...storedLocation,
    };

    const result = await Axios.request({
      url,
      params: updatedParams,
      method,
      data,
      headers,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return { error };
  }
};
