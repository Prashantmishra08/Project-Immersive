import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const PrivateRoute = () => {
  const { authUser } = useAuthContext();
  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
