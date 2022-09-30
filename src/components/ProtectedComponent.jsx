// import React, { Children } from 'react'

const ProtectedComponent = ({ children, role }) => {
  let userRole = localStorage.getItem("priyam-store-role");
  // const roleAccessArray = ['admin', 'manager', 'productManager']

  if (role === "admin" && userRole === "admin") {
    // Only accesible to admin
    return children;
  } else if (
    role === "manager" &&
    (userRole === "admin" || userRole === "manager")
  ) {
    // Only accesible till manager
    return children;
  } else {
    return <></>;
  }
};

export default ProtectedComponent;
