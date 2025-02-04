import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  if (!token) {
    navigate('/login');
    return <></>;
    // return <Redirect to="/login" />;
  }

  return children;
};

export default ProtectedRoutes;
