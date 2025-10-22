import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Unauthorized from '../pages/OtherPage/Unauthorized';
import RoleEnum from '../utils/enumerations';
 
interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: RoleEnum[];
}
 
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requireAdmin = false,
  allowedRoles
}) => {
  const location = useLocation();
  const { currentUser, isAuthenticated, isInitialized } = useAuth();
  
  // Show loading or wait for initialization
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with the attempted location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && currentUser?.role !== RoleEnum.Admin) {
    return <Unauthorized />;
  }
 
  // If specific roles are allowed, check if user has one of them
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Unauthorized />;
  }
 
  // If user is authenticated and has proper access, render the children
  return <>{children}</>;
};
 
export default PrivateRoute;