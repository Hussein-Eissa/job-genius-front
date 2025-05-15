import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "@/reducers/UserReducerStore";

const allowedPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

const ProtectedRoute = () => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated && !allowedPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
