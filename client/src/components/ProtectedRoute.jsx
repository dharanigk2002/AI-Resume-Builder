import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <Loader />;
  else if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
