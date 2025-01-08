import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "src/contexts/auth";
import { toast } from "react-toastify";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuthContext();

  if (!token) {
    toast.error("You need to be logged in to access this page");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
