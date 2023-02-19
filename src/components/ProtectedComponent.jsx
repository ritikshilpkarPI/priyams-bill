const ProtectedComponent = ({ children, role, data }) => {
  const { role: userRole = '' } = JSON.parse(
    localStorage.getItem('priyam-store')
  );

  if (role?.includes(userRole)) {
    return children;
  } else {
    return <></>;
  }
};

export default ProtectedComponent;
