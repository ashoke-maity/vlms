import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow separate admin session via localStorage adminSession
  const adminSession = typeof window !== 'undefined' ? localStorage.getItem('adminSession') === 'true' : false;

  if (!isAuthenticated && !adminSession) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  const role = user?.role || user?.Role || user?.isAdmin ? 'admin' : user?.role;
  const isAdmin = role === 'admin' || user?.isAdmin === true;

  if (!isAdmin && !adminSession) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default AdminRoute;


