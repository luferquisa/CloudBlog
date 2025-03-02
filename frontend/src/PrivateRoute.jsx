import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
    console.log("usuario si esta "+auth.loading+" ");
    const { user, loading } = auth;
    console.log("Cargando "+loading);
  if (loading) {
    return <p>Cargando...</p>;
  }
  //return children;
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
