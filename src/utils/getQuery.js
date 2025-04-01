import { useLocation } from 'react-router-dom';

export const useQueryParam = (key) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    return query.get(key) || "";
}