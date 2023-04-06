import Cookies from "js-cookie";
import { parseJwt } from "src/utils/cookie";

const ProtectedComponent = ({ children, role, data }) => {
  const { role: userRole = '' } =  parseJwt(Cookies.get('token'))
  if (role?.includes(userRole)) {
    return children;
  } else {
    return <></>;
  }
};

export default ProtectedComponent;
