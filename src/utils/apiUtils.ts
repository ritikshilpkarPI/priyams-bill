import { getAPI } from './apiMethods';
import { API_PATHS } from './constants/apiPaths';

export const getUserDataAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.BILLING.GET_USER_DETAILS,
    });
    return response;
  } catch (err) {
    return { isError: true, err };
  }
};
