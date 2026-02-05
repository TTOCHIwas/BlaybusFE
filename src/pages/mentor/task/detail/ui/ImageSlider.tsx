import { useState, useEffect } from 'react';
import { Box, Center, IconButton, Image, Text, HStack, useToast } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ChatIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

import { FeedbackOverlay } from '@/features/task-feedback/ui/FeedbackOverlay';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { UserRole } from '@/shared/constants/enums';
import { MOCK_FEEDBACKS, MOCK_ANSWERS } from '@/features/task-feedback/model/mockFeedbackData';

interface SubmissionImageData {
  id: string;
  imageUrl: string;
}

interface ImageSliderProps {
  images: SubmissionImageData[];
  taskId: string;
  currentUserId: string;
  userRole: UserRole;
}

export const ImageSlider = ({ images, taskId, currentUserId, userRole }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useToast();

  const loadFeedbacks = useTaskFeedbackStore(s => s.loadFeedbacks);
  const loadAnswers = useTaskFeedbackStore(s => s.loadAnswers);
  const setCurrentImageId = useTaskFeedbackStore(s => s.setCurrentImageId);
  const commentMode = useTaskFeedbackStore(s => s.commentMode);
  const setCommentMode = useTaskFeedbackStore(s => s.setCommentMode);
  const canAddFeedback = useTaskFeedbackStore(s => s.canAddFeedback);

  const currentImage = images[currentIndex];

  useEffect(() => {
    loadFeedbacks(MOCK_FEEDBACKS);
    loadAnswers(MOCK_ANSWERS);
  }, [loadFeedbacks, loadAnswers]);

  useEffect(() => {
    if (currentImage) {
      setCurrentImageId(currentImage.id);
    }
  }, [currentImage, setCurrentImageId]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCommentModeToggle = () => {
    if (commentMode === 'create') {
      setCommentMode('view');
    } else {
      if (!canAddFeedback(currentImage.id)) {
        toast({ status: 'warning', title: '피드백은 이미지당 최대 3개까지만 가능합니다.' });
        return;
      }
      setCommentMode('create');
      toast({ status: 'info', title: '이미지 위를 클릭하여 피드백을 남겨주세요.' });
    }
  };

  if (!images || images.length === 0) {
    return (
      <Center bg="gray.100" h="400px" borderRadius="md" color="gray.500" flexDirection="column">
        <Text>제출된 이미지가 없습니다.</Text>
      </Center>
    );
  }

  return (
    <Box position="relative" width="full" maxW="600px" mx="auto" mb={20}>
      
      <Box
        position="relative"
        height="auto"
        minH="600px"
        borderRadius="24px"
        bg="#E5E7EB"
        overflow="hidden" 
        zIndex={1} 
      >
        <AnimatePresence initial={false} mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            <Image
              src={currentImage.imageUrl}
              alt={`Submission ${currentIndex + 1}`}
              objectFit="contain"
              w="100%"
              h="100%"
            />
          </motion.div>
        </AnimatePresence>

        <Box
          position="absolute"
          top={6}
          right={6}
          fontSize="16px"
          fontWeight="medium"
          color="#4B5563"
          zIndex={5}
        >
          {currentIndex + 1}/{images.length}
        </Box>
      </Box>

      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        zIndex={10} 
      >
        <FeedbackOverlay 
          taskId={taskId}
          imageId={currentImage.id}
          currentUserId={currentUserId}
          userRole={userRole}
        />
      </Box>

      {userRole === "MENTOR" && (
        <Box position="absolute" bottom={-16} right={0} zIndex={20}>
          <HStack spacing={2} align="center">
            <Text
              fontSize="13px"
              fontWeight="bold"
              color="#3B82F6"
              cursor="pointer"
              onClick={handleCommentModeToggle}
            >
              {commentMode === 'create' ? '작성 취소' : '코멘트'}
            </Text>
            <IconButton
              aria-label="Comments"
              icon={<ChatIcon boxSize={5} color="white" />}
              isRound
              w="48px" h="48px"
              bg={commentMode === 'create' ? 'red.400' : '#3B82F6'}
              _hover={{ bg: commentMode === 'create' ? 'red.500' : 'blue.600' }}
              boxShadow="md"
              onClick={handleCommentModeToggle}
            />
          </HStack>
        </Box>
      )}

      {images.length > 1 && (
        <>
          <IconButton
            aria-label="Previous image"
            icon={<ChevronLeftIcon w={6} h={6} color="#9CA3AF" />}
            position="absolute"
            left="-24px"
            top="50%"
            transform="translateY(-50%)"
            onClick={handlePrev}
            isRound
            w="40px" h="40px"
            bg="white"
            boxShadow="md"
            _hover={{ bg: 'gray.50' }}
            zIndex={30}
            border="1px solid"
            borderColor="gray.100"
          />
          <IconButton
            aria-label="Next image"
            icon={<ChevronRightIcon w={6} h={6} color="#9CA3AF" />}
            position="absolute"
            right="-24px"
            top="50%"
            transform="translateY(-50%)"
            onClick={handleNext}
            isRound
            w="40px" h="40px"
            bg="white"
            boxShadow="md"
            _hover={{ bg: 'gray.50' }}
            zIndex={30}
            border="1px solid"
            borderColor="gray.100"
          />
        </>
      )}
    </Box>
  );
};