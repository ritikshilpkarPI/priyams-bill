import Cookies from 'js-cookie';
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
    const result = await Axios.request({
      url,
      params,
      method,
      data,
      headers,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return {error};
  }
};
