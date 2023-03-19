import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const history = useHistory();
  const token = Cookies.get('token');
  if (!token) {
    history.push('/login');
    return <></>;
    // return <Redirect to="/login" />;
  }

  return children;
};

export default ProtectedRoutes;
