import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { MentorHeader, MentorSidebar } from '@/widgets/mentor-layout';

export const MentorLayout = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <MentorHeader />
      <MentorSidebar />
      
      <Box
        as="main"
        ml="240px"
        pt="60px" 
        p={8}     
        minH="100vh"
        transition="margin-left 0.2s"
      >
        <Outlet />
      </Box>
    </Box>
  );
};