import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Login from "./Login";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { roles } = useAuth();

  return roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    /* Review this one. It should not redirect to Login..seems like bad design */
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default RequireAuth;
