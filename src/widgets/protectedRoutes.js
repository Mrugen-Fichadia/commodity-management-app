import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem('user')); // e.g., { username: 'abc', role: 'manager' }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
