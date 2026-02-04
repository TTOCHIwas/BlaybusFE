import { Box, Container, VStack } from '@chakra-ui/react';
import { PlannerHeader } from '@/widgets/planner/PlannerHeader';
import { TaskList } from '@/widgets/planner/TaskList';
import { StudyTimeChart } from '@/widgets/planner/StudyTimeChart';
import { DailyMemoWidget } from '@/widgets/planner/ui/DailyMemoWidget'; 
import { MentorFeedbackWidget } from '@/widgets/planner/ui/MentorFeedbackWidget';


const MenteePlannerPage = () => {
  return (
    <Container maxW="md" p={0} minH="100vh" bg="gray.50">
      <PlannerHeader />
      
      <Box px={4} py={2}>
        <VStack spacing={6} align="stretch">
          <TaskList />
          <StudyTimeChart />
          <DailyMemoWidget />
          <MentorFeedbackWidget />
        </VStack>
      </Box>
    </Container>
  );
};

export default MenteePlannerPage;