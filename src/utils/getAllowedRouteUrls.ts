import { protectedRouteMap } from '../routes/protectedRouteMap';
import { parseJwtToken } from './cookie';

export const getAllowedRouteUrlList = () => {
  const { allowedRoutes = [] } = parseJwtToken() ?? {};
  const result = allowedRoutes
    .map((key: string) => {
      return protectedRouteMap[key]?.path;
    })
    .filter(Boolean);
  return result;
};
