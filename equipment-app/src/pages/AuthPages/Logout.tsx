import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export default function Logout() {
  const auth = useAuth();

  useEffect(() => {
    // Perform logout when component mounts
    auth.logout();
    // Optional: Clear any other application state here
    // For example: clear any cached data, reset form states, etc.
  }, [auth]);

  // Redirect to login page after logout
  return <Navigate to="/login" replace />;
}
