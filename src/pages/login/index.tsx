import { Center, Box, VStack } from '@chakra-ui/react';
import { LoginForm } from '@/features/auth';

const LoginPage = () => {
  return (
    <Center minH="100vh" bg="#F9F9FB" p={4}>
      <VStack spacing={8}>
        {/* Logo Section */}
        <Box>
          <img src="/src/assets/Subtract.svg" alt="SeolStudy Logo" width="120" />
        </Box>

        <Box
          w="full"
          minW="400px" // Slightly wider as per screenshot implication
          bg="white"
          p={10}
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="#E0E5EB"
        >
          <LoginForm />
        </Box>
      </VStack>
    </Center>
  );
};

export default LoginPage;