import { Box, Text, Flex } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';

export const MentorFeedbackWidget = () => {
  const { currentDailyPlanner } = usePlannerStore();
  const feedback = currentDailyPlanner?.mentorFeedback;

  return (
    <Box 
      px={{base:4, md:0}} 
    >
      <Flex align="center" mb={2} gap={2}>
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
        >
          멘토 피드백
        </Text>
      </Flex>

      <Flex gap={3} align="flex-start">
        <Box 
          flex={1}
          bg="white" 
          borderRadius="10" 
          borderTopLeftRadius="0" 
          boxShadow="sm"
        >
          {feedback ? (
            <Text fontSize="sm" color="gray.800" bg={{base:"white", md:"#F9F9FB"}} whiteSpace="pre-wrap" p={6}>
              {feedback}
            </Text>
          ) : (
            <Text fontSize="sm" color="gray.400" bg={{base:"white", md:"#F9F9FB"}} p={6}>
              아직 작성된 피드백이 없어요.
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};          