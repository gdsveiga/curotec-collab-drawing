import { lazy } from "react";
import { Navigate } from "react-router-dom";
import PublicLayout from "src/layout/public";
import ProtectedLayout from "src/layout/protected";

const LazyRegister = lazy(() => import("src/pages/register"));
const LazyLogin = lazy(() => import("src/pages/login"));
const LazyHome = lazy(() => import("src/pages/home"));

const publicRoutes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LazyLogin />,
  },
  {
    path: "/register",
    element: <LazyRegister />,
  },
];
const protectedRoutes = [
  {
    path: "/draw/home",
    element: <LazyHome />,
  },
];

export const routes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: publicRoutes,
  },
  {
    path: "/draw",
    element: <ProtectedLayout />,
    children: protectedRoutes,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];
