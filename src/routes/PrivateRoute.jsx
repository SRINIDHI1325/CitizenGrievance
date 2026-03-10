import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role, userRole }) {
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (role !== userRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;