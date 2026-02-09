import { Box, VStack, HStack, Text, Icon, IconButton, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { SeolStudyLogo } from '@/shared/ui/SeolStudyLogo';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuthStore } from '@/shared/stores/authStore';
import { SidebarMenuItem } from './components/SidebarMenuItem';
import { MenteeListToggle } from './components/MenteeListToggle';
import { MenteeNavItem } from './components/MenteeMenuItem';
import { getNavItems } from '../navConfig';
import { FiLogOut } from 'react-icons/fi';
import { mentoringApi } from '@/features/mentoring/api/mentoringApi';
import { useNavigate } from 'react-router-dom';

interface Props {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const DesktopSidebar = ({ isCollapsed, onToggleSidebar }: Props) => {
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const [mentees, setMentees] = useState<MenteeNavItem[]>([]);
  const navigate = useNavigate();

  const menteeNavItems = getNavItems('MENTEE');

  useEffect(() => {
    if (role !== 'MENTOR') return;
    let active = true;
    mentoringApi
      .listMentees({ page: 0, size: 200 })
      .then((list) => {
        if (!active) return;
        setMentees(list);
      })
      .catch(() => {
        if (!active) return;
        setMentees([]);
      });
    return () => {
      active = false;
    };
  }, [role]);

  const handleLogout = () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <Box
      as="nav"
      w={isCollapsed ? '80px' : '280px'}
      h="100vh"
      bg="white"
      borderRight="6px solid #F7F7F7"
      position="fixed"
      top={0}
      left={0}
      zIndex="1100"
      transition="width 0.3s ease"
      display="flex"
      flexDirection="column"
    >
      <Box
        flex={1}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '4px',
          },
        }}
      >
        <VStack spacing={8} align="stretch" p={2} mt={8}>
          <Flex
            h="64px"
            alignItems="center"
            justifyContent={isCollapsed ? 'center' : 'space-between'}
            px={isCollapsed ? 0 : 4}
            mb={4}
          >
            {isCollapsed ? (
              <IconButton
                icon={<HamburgerIcon w={5} h={5} />}
                aria-label="Expand Sidebar"
                onClick={onToggleSidebar}
                variant="ghost"
                _hover={{ bg: 'gray.100' }}
              />
            ) : (
              <>
                <SeolStudyLogo w="130px" h="auto" />
                <IconButton
                  icon={<HamburgerIcon w={5} h={5} />}
                  aria-label="Collapse Sidebar"
                  onClick={onToggleSidebar}
                  variant="ghost"
                  size="sm"
                  color="gray.400"
                  _hover={{ bg: 'gray.100', color: 'gray.600' }}
                />
              </>
            )}
          </Flex>

          {role === 'MENTOR' && (
            <>
              {getNavItems('MENTOR').map((item) => (
                <SidebarMenuItem
                  key={item.path}
                  label={item.label}
                  path={item.path}
                  icon={<item.icon w={4} h={4} />}
                  isCollapsed={isCollapsed}
                />
              ))}
              <MenteeListToggle mentees={mentees} isCollapsed={isCollapsed} />
            </>
          )}

          {role === 'MENTEE' && (
            <>
              {menteeNavItems.map((item) => (
                <SidebarMenuItem
                  key={item.path}
                  label={item.label}
                  path={item.path}
                  icon={<item.icon w={4} h={4} />}
                  isCollapsed={isCollapsed}
                />
              ))}
            </>
          )}
        </VStack>
      </Box>

      <Box p={2} borderTop="1px solid" borderColor="gray.100" bg="white">
        <HStack
          onClick={handleLogout}
          w="full"
          h="48px"
          px={isCollapsed ? 0 : 4}
          justify={isCollapsed ? 'center' : 'flex-start'}
          borderRadius="lg"
          cursor="pointer"
          color="gray.500"
          transition="all 0.2s"
          _hover={{ bg: 'red.50', color: 'red.500' }}
          spacing={3}
        >
          <Icon as={FiLogOut} w={5} h={5} />

          {!isCollapsed && (
            <Text fontSize="md" fontWeight="medium">
              로그아웃
            </Text>
          )}
        </HStack>
      </Box>
    </Box>
  );
};
