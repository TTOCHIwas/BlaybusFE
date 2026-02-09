import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore, isTokenValid, logoutAndClear } from '@/shared/stores/authStore';
import { getNavItems } from './navConfig';
import { useFcmRegistration } from '@/features/notification/model/useFcmRegistration';
import { userApi } from '@/features/user/api/userApi';
import { Loading } from '@/shared/ui/Loading';

// PC Widgets
import { DesktopHeader } from './desktop/DesktopHeader';
import { DesktopSidebar } from './desktop/DesktopSidebar';

// Mobile Widgets
import { MobileHeader } from './mobile/MobileHeader';
import { MobileBottomNav } from './mobile/MobileBottomNav';

export const MainLayout = () => {
  const { user, token, isAuthenticated, setUser } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const tokenValid = isTokenValid(token);
  useFcmRegistration();

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      if (!tokenValid) {
        logoutAndClear();
        if (!cancelled) setIsBootstrapping(false);
        return;
      }

      if (!user) {
        try {
          const me = await userApi.getMe();
          if (!cancelled) setUser(me);
        } catch {
          logoutAndClear();
        }
      }

      if (!cancelled) setIsBootstrapping(false);
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [tokenValid, user, setUser]);

  if (!isAuthenticated || !tokenValid) {
    return <Navigate to="/login" replace />;
  }

  if (isBootstrapping) {
    return <Loading />;
  }

  if (!user) return null;

  const navItems = getNavItems(user.role);
  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <Box minH="100vh">
      <Box display={{ base: 'none', md: 'block' }}>
        <DesktopHeader isCollapsed={isCollapsed} />
        <DesktopSidebar
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
        <Box
          ml={sidebarWidth}
          mt="0"
          pt="90px"
          minH="100vh"
          transition="margin-left 0.3s ease"
        >
          <Outlet />
        </Box>
      </Box>

      <Box display={{ base: 'block', md: 'none' }}>
        <MobileHeader />
        <Box pt="4.5rem" pb="64px" px={0} minH="100vh" bg={{base:"#F9F9FB", md:"white"}}>
          <Outlet />
        </Box>

        <MobileBottomNav navItems={navItems} />
      </Box>
    </Box>
  );
};
