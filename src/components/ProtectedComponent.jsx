const ProtectedComponent = ({ children, role }) => {
  let userRole = JSON.parse(localStorage.getItem("priyam-store")).role;

  if (role.includes(userRole)) {
    return children;
  } else {
    return <></>;
  }
};

export default ProtectedComponent;