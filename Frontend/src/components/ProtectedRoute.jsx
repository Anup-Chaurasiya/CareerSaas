import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();
  
  if (!auth) {
    // Redirect to login with return url
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;