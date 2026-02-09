import { Flex, Text, HStack, Box } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useLocation } from 'react-router-dom';
import { NotificationBell } from '@/widgets/notifications/NotificationBell';

interface Props {
  isCollapsed: boolean;
}

export const DesktopHeader = ({ isCollapsed }: Props) => {
  const { user } = useAuthStore();
  const sidebarWidth = isCollapsed ? '80px' : '280px';
  const location = useLocation();

  const menteeHeaderPaths = [
    '/mentee/planner',
    '/mentee/calendar',
    '/mentee/feedback',
    '/mentee/mypage',
  ];
  const showNotificationBell =
    user?.role === 'MENTEE' && menteeHeaderPaths.includes(location.pathname);
  const showGreeting =
    location.pathname === '/mentee/mypage' || location.pathname === '/mentor/mypage';

  return (
    <Flex
      as="header"
      h="80px"
      bg="#fff"
      pl={`calc(${sidebarWidth} + 28px)`}
      transition="padding-left 0.3s ease"
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      pointerEvents="none"
    >
      <Box flex="1">
        {showGreeting && (
          <Text
            fontFamily="Pretendard"
            fontSize="20px"
            fontWeight="600"
            color="#394250"
            lineHeight="normal"
            pointerEvents="auto"
          >
            어서오세요, <Text as="span" color="#52A8FE">{user?.name}</Text>
            {user?.role === 'MENTOR' ? '멘토님!' : '님!'}
          </Text>
        )}
      </Box>
      <HStack spacing={2} mr="24px" pointerEvents="auto">
        <NotificationBell isVisible={showNotificationBell} />
      </HStack>
    </Flex>
  );
};
