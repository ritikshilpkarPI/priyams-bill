import Cookies from "js-cookie";

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const parseJwtToken = () => {
  const token = Cookies.get('token')
  return parseJwt(token);
}