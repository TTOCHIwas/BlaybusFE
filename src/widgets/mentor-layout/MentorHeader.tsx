import { Flex, Text, HStack, Avatar, Box } from '@chakra-ui/react';
import { useAuthStore } from '@/shared/stores/authStore';

export const MentorHeader = () => {
  const { user } = useAuthStore();

  return (
    <Flex
      as="header"
      h="60px"
      px={6}
      align="center"
      justify="space-between"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
    >
      <HStack spacing={2} cursor="pointer" onClick={() => window.location.href = '/mentor'}>
        <Text fontSize="xl" fontWeight="black" color="blue.600">
          SeolStudy
        </Text>
        <Text fontSize="xs" color="gray.500" fontWeight="bold" mt={1}>
          Mentor
        </Text>
      </HStack>

      <HStack spacing={3}>
        <Box textAlign="right" display={{ base: 'none', md: 'block' }}>
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            {user?.name || '멘토'}님
          </Text>
          <Text fontSize="xs" color="gray.500">
            멘토링 진행중
          </Text>
        </Box>
        <Avatar size="sm" name={user?.name} bg="blue.500" color="white" />
      </HStack>
    </Flex>
  );
};