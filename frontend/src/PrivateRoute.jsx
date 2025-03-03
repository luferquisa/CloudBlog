import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
    const { user, loading } = auth;
  if (loading) {
    return <p>Cargando...</p>;
  }
  //return children;
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
