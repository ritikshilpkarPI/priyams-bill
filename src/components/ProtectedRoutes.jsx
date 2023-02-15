import { useHistory } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const history = useHistory();

  if (!localStorage.getItem('priyam-store')) {
    history.push('/login');
    return <></>;
    // return <Redirect to="/login" />;
  }

  return children;
};

export default ProtectedRoutes;
