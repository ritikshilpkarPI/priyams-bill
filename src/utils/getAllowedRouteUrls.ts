import { parseJwtToken } from './cookie';
import { protectedRouteMap } from '../routes/routes';

export const getAllowedRouteUrlList = () => {
  const { allowedRoutes = [] } = parseJwtToken();
  const result = allowedRoutes
    .map((key: string) => {
      return protectedRouteMap[key]?.path;
    })
    .filter(Boolean);
  return result;
};
