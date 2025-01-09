import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "src/contexts/auth";
import { toast } from "react-toastify";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuthContext();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
