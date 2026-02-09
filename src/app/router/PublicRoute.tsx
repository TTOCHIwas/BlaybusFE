import { Navigate } from 'react-router-dom';
import { useAuthStore, isTokenValid } from '@/shared/stores/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user, token } = useAuthStore();
  const tokenValid = isTokenValid(token);

  if (isAuthenticated && tokenValid && user) {
    if (user.role === 'MENTOR') {
      return <Navigate to="/mentor" replace />;
    }
    if (user.role === 'MENTEE') {
      return <Navigate to="/mentee/planner" replace />;
    }
  }

  return <>{children}</>;
};
