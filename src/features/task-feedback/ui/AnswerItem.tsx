import { Box, Flex, Text, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { AnswerWithAuthor } from '../model/types';
import { formatRelativeTime } from '../model/feedbackUtils';

interface AnswerItemProps {
  answer: AnswerWithAuthor;
  currentUserId: string;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

const MoreIcon = (props: any) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="5" cy="12" r="2" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <circle cx="19" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export const AnswerItem = ({ answer, currentUserId, onEdit, onDelete }: AnswerItemProps) => {
  const isAuthor = answer.userId === currentUserId;
  const isMentor = answer.authorRole === "MENTOR";

  return (
    <Box mb={3}>
      <Flex justify="space-between" align="flex-start">
        <Flex gap={2} align="center" mb={1}>
          <Text fontSize="xs" fontWeight="bold" color={isMentor ? 'blue.600' : 'gray.700'}>
            {answer.authorName}
            {isMentor && <Text as="span" fontSize="10px" ml={1}>(멘토)</Text>}
          </Text>
          <Text fontSize="10px" color="gray.400">· {formatRelativeTime(answer.createdAt)}</Text>
        </Flex>
        
        {isAuthor && (
          <Menu isLazy>
            <MenuButton 
              as={IconButton} 
              icon={<MoreIcon />} 
              size="xs" 
              variant="ghost" 
              aria-label="Options"
              h="20px"
              minW="20px"
              color="gray.400"
              _hover={{ color: 'gray.600', bg: 'transparent' }}
            />
            <MenuList minW="80px" fontSize="xs">
              <MenuItem onClick={() => {
                const newText = prompt('댓글 수정', answer.comment);
                if (newText) onEdit(answer.id, newText);
              }}>수정</MenuItem>
              <MenuItem color="red.500" onClick={() => onDelete(answer.id)}>삭제</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
      <Text fontSize="xs" color="gray.600" whiteSpace="pre-wrap" lineHeight="1.4">{answer.comment}</Text>
    </Box>
  );
};