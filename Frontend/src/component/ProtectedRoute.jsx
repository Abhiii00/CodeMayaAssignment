import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const loginData = Cookies.get("Code_Maya_Assignment");
  
  if (!loginData) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(loginData).user;

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
