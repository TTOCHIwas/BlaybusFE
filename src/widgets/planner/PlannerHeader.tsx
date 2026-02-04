import { Flex, Text, Button, Box } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { CalendarWidget } from './ui/CalendarWidget'; 

export const PlannerHeader = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="white">
      <Flex 
        px={4} 
        py={3}
        bg="white"
        align="center"
        justify="space-between" 
        borderBottom="1px solid" 
        borderColor="gray.100"
      >
        <Text fontSize="lg" fontWeight="bold" color="gray.800">일일 플래너</Text>
        <Button size="xs" variant="outline" onClick={handleLogout}>
          로그아웃
        </Button>
      </Flex>
      <CalendarWidget />
    </Box>
  );
};