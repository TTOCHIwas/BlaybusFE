import { Box, Text, VStack, Badge, Flex, Avatar, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { CommentAvartarIcon } from '@/shared/ui/icons';
import { SUBJECT_COLORS, SUBJECT_LABELS } from '@/shared/constants/subjects';
import { RecentSubmittedTask } from '../../../pages/mentor/mypage/model/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  tasks: RecentSubmittedTask[];
}

export const RecentTaskList = ({ tasks }: Props) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Text
        color="#373E56"
        fontFamily="Pretendard"
        fontSize={{base:"16px", md:"24px"}}
        fontStyle="normal"
        fontWeight="700"
        lineHeight="normal"
        mb="28px"
      >
        최근 제출된 과제
      </Text>

      <VStack spacing={3} align="stretch">
        {tasks.map((task) => (
          <Flex
            key={task.id}
            p="15px 32px"
            borderRadius="22px"
            border="1px solid"
            borderColor="#F9F9FB"
            bg="#F9F9FB"
            align="center"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
            onClick={() => navigate(`/mentor/mentee/${task.menteeId}/task/${task.id}`)}
          >
            <VStack spacing={1} mr={5} minW="50px">
              <Avatar 
                  sx={{
                    w: { base: '32px', md: '32px' },
                    h: { base: '32px', md: '32px' }
                  }}
                  icon={<CommentAvartarIcon size="100%" color='#D9D9D9' />}
                  bg="transparent"
                />
              <Text fontSize="xs" color="gray.500">{task.menteeName}</Text>
            </VStack>

            <Text fontSize="md" fontWeight="bold" color="gray.700" flex={1} isTruncated>
              {task.title}
            </Text>

            <Flex align="center" ml={2}>
              <Badge
                bg={SUBJECT_COLORS[task.subject as keyof typeof SUBJECT_COLORS] || SUBJECT_COLORS.OTHER}
                color="white"
                variant="solid"
                borderRadius="full"
                px={4}
                py={1}
                fontSize="sm"
                fontWeight="bold"
              >
                {SUBJECT_LABELS[task.subject as keyof typeof SUBJECT_LABELS] || task.subject}
              </Badge>
              <Icon as={ChevronRightIcon} color="gray.400" w={6} h={6} ml={3} />
            </Flex>
          </Flex>
        ))}

        {tasks.length === 0 && (
          <Text color="gray.400" fontSize="sm" textAlign="center" py={4}>
            제출된 과제가 없습니다.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

