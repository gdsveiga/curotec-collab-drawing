import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "src/components/auth/protected-route";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default ProtectedLayout;
