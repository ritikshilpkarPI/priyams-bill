import { Axios } from './axios';
export const genericAxios = async ({
  url = '',
  params = {},
  method = 'get',
  data = {},
  headers = {
    'Content-Type': 'application/json',
    Cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDZjZjFiOTgzZTg1YmZiOTNlNTg4ZCIsIm5hbWUiOiJUZXN0IEFkbWluIiwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJ0ZXN0X2FkbWluIiwiaWF0IjoxNzM5NTk2NTU2LCJleHAiOjE3NDIxODg1NTZ9.9mOY7RXYioi-9zmVyZZM6ZQxOfwL0J0K7XT6n74NkLs',
  },
}) => {
  try {
    const result = await Axios.request({
      url,
      params,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDZjZjFiOTgzZTg1YmZiOTNlNTg4ZCIsIm5hbWUiOiJUZXN0IEFkbWluIiwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJ0ZXN0X2FkbWluIiwiaWF0IjoxNzM5NTk2NTU2LCJleHAiOjE3NDIxODg1NTZ9.9mOY7RXYioi-9zmVyZZM6ZQxOfwL0J0K7XT6n74NkLs'
      },
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return { error };
  }
};
