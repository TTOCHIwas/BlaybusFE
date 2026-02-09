import { Navigate } from 'react-router-dom';
import { useAuthStore, isTokenValid } from '@/shared/stores/authStore';

export const RootRedirect = () => {
  const { isAuthenticated, user, token } = useAuthStore();
  const tokenValid = isTokenValid(token);

  if (!isAuthenticated || !tokenValid) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'MENTOR') {
    return <Navigate to="/mentor" replace />;
  }

  if (user?.role === 'MENTEE') {
    return <Navigate to="/mentee/planner" replace />;
  }

  return <Navigate to="/login" replace />;
};
