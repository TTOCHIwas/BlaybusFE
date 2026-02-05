import { useState } from 'react';
import { Box, Flex, Text, IconButton, Image, Input, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { CloseIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { FeedbackWithAuthor, AnswerWithAuthor } from '../model/types';
import { formatRelativeTime, parseEmphasis, getFeedbackPositionStyles } from '../model/feedbackUtils';
import { AnswerItem } from './AnswerItem';
import { FeedbackInputForm } from './FeedbackInputForm';
import { UserRole } from '@/shared/constants/enums';

interface FeedbackCardProps {
  feedback: FeedbackWithAuthor;
  answers: AnswerWithAuthor[];
  currentUserId: string;
  userRole: UserRole;
  onClose: () => void;
  onUpdateFeedback: (content: string, imageUrl: string | null) => void;
  onDeleteFeedback: () => void;
  onAddAnswer: (comment: string) => void;
  onUpdateAnswer: (id: string, comment: string) => void;
  onDeleteAnswer: (id: string) => void;
}

const MotionBox = motion(Box);

// 점 3개 아이콘 (More)
const MoreIcon = (props: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="5" cy="12" r="2" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <circle cx="19" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export const FeedbackCard = ({
  feedback,
  answers,
  currentUserId,
  userRole,
  onClose,
  onUpdateFeedback,
  onDeleteFeedback,
  onAddAnswer,
  onUpdateAnswer,
  onDeleteAnswer
}: FeedbackCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  const isMentor = userRole === "MENTOR";
  const isAuthor = feedback.mentorId === currentUserId;

  const { positionStyles, transformOrigin, marginStyles } = getFeedbackPositionStyles(feedback.xPos, feedback.yPos);

  if (isEditing) {
    return (
      <Box 
        position="absolute" 
        zIndex={200} 
        onClick={(e) => e.stopPropagation()}
        style={{ ...positionStyles, ...marginStyles }}
      >
         <FeedbackInputForm
           initialContent={feedback.content}
           initialImageUrl={feedback.imageUrl}
           onSave={(c, i) => {
             onUpdateFeedback(c, i);
             setIsEditing(false);
           }}
           onCancel={() => setIsEditing(false)}
         />
      </Box>
    );
  }

  return (
    <MotionBox
      layoutId={`feedback-${feedback.id}`} 
      position="absolute"
      zIndex={200}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      style={{ ...positionStyles, ...marginStyles }}
      
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      transformOrigin={transformOrigin}
      
      bg="white"
      borderRadius="12px"
      boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
      w="320px"
      maxW="90vw"
      overflow="hidden"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" p={3} borderBottom="1px solid" borderColor="gray.50" bg="white">
        <Flex gap={2} align="center">
          <Box w="24px" h="24px" borderRadius="full" bg="blue.100" display="flex" alignItems="center" justifyContent="center">
             <Text fontSize="xs" fontWeight="bold" color="blue.600">
               {feedback.authorName[0]}
             </Text>
          </Box>
          <Text fontWeight="bold" fontSize="sm" color="gray.800">{feedback.authorName}</Text>
          <Text fontSize="xs" color="gray.400">{formatRelativeTime(feedback.createdAt)}</Text>
        </Flex>
        
        <Flex gap={1}>
          {isMentor && isAuthor && (
            <Menu isLazy>
              <MenuButton as={IconButton} icon={<MoreIcon />} size="xs" variant="ghost" aria-label="Options" color="gray.400" _hover={{ bg: 'gray.50', color: 'gray.600' }} />
              <MenuList minW="100px" fontSize="sm">
                <MenuItem onClick={() => setIsEditing(true)}>수정</MenuItem>
                <MenuItem color="red.500" onClick={onDeleteFeedback}>삭제</MenuItem>
              </MenuList>
            </Menu>
          )}
          <IconButton icon={<CloseIcon boxSize={2.5} color="gray.400" />} size="xs" variant="ghost" aria-label="Close" onClick={onClose} _hover={{ bg: 'gray.50', color: 'gray.600' }} />
        </Flex>
      </Flex>

      {/* Body */}
      <Box p={4} maxH="300px" overflowY="auto">
        <Text 
          fontSize="sm" 
          lineHeight="1.6"
          color="gray.700"
          mb={feedback.imageUrl ? 3 : 0}
          sx={{
            'strong': { color: 'blue.600', fontWeight: '800', bg: 'blue.50', px: 1, borderRadius: '2px' }
          }}
          dangerouslySetInnerHTML={{ __html: parseEmphasis(feedback.content) }} 
        />
        {feedback.imageUrl && (
          <Image src={feedback.imageUrl} alt="Feedback Attachment" borderRadius="lg" maxH="200px" objectFit="cover" w="full" border="1px solid" borderColor="gray.100" />
        )}
      </Box>

      {/* Footer (Comments) */}
      <Box bg="gray.50" p={3}>
        <Box maxH="150px" overflowY="auto" mb={3} css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
           {answers.map(ans => (
             <AnswerItem key={ans.id} answer={ans} currentUserId={currentUserId} onEdit={onUpdateAnswer} onDelete={onDeleteAnswer} />
           ))}
        </Box>
        <Flex gap={2} bg="white" p={1} borderRadius="full" border="1px solid" borderColor="gray.200" align="center">
          <Input variant="unstyled" placeholder="댓글 달기..." value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} fontSize="sm" px={3} h="32px" />
          <IconButton aria-label="Send" icon={<ArrowForwardIcon />} size="sm" colorScheme="blue" isRound isDisabled={!newAnswer.trim()} onClick={() => { onAddAnswer(newAnswer); setNewAnswer(''); }} />
        </Flex>
      </Box>
    </MotionBox>
  );
};