import { Navigate } from 'react-router-dom';
import { useAuthStore, isTokenValid } from '@/shared/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useAuthStore();
  const tokenValid = isTokenValid(token);

  if (!isAuthenticated || !tokenValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
