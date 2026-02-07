import { useState } from 'react';
import { VStack, Button, Text, useToast, Box } from '@chakra-ui/react';
import { useLogin } from '../model/useLogin';
import { Input } from '@/shared/ui/Input';

export const LoginForm = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useLogin();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginId.trim()) {
      toast({ description: '아이디를 입력해주세요', status: 'warning', duration: 2000 });
      return;
    }
    if (!password.trim()) {
      toast({ description: '비밀번호를 입력해주세요', status: 'warning', duration: 2000 });
      return;
    }

    login(loginId, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="#373E56" mb={2}>아이디</Text>
          <Input
            placeholder=""
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            isDisabled={isLoading}
            height="50px"
            borderColor="#E0E5EB"
            borderRadius="md"
            _focus={{ borderColor: '#53A8FE', boxShadow: 'none' }}
            _hover={{ borderColor: '#53A8FE' }}
            color="#373E56"
          />
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="bold" color="#373E56" mb={2}>비밀번호</Text>
          <Input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
            height="50px"
            borderColor="#E0E5EB"
            borderRadius="md"
            _focus={{ borderColor: '#53A8FE', boxShadow: 'none' }}
            _hover={{ borderColor: '#53A8FE' }}
            color="#373E56"
          />
        </Box>

        <Button
          type="submit"
          bg="#53A8FE"
          color="white"
          size="lg"
          height="50px"
          borderRadius="md"
          fontSize="md"
          fontWeight="bold"
          isLoading={isLoading}
          loadingText="로그인 중"
          mt={4}
          _hover={{ bg: '#4293E3' }}
          _active={{ bg: '#3178C6' }}
        >
          로그인
        </Button>
      </VStack>
    </form>
  );
};