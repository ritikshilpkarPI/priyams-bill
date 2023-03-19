export const parseJwt = (token) => {
    console.log({token});
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };