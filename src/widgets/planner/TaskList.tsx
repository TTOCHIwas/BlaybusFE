import { VStack, Text, Button } from '@chakra-ui/react';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { TaskItem } from '@/features/task/ui/TaskItem';
import { useNavigate } from 'react-router-dom';

export const TaskList = () => {
  const { tasks, toggleTaskComplete, deleteTask } = usePlannerStore();
  const navigate = useNavigate();

  const handleTaskClick = (taskId: string) => {
    navigate(`/mentee/task/${taskId}`);
  };

  return (
    <VStack spacing={3} align="stretch" pb={20}>
      {tasks.length === 0 ? (
        <Text textAlign="center" color="gray.500" py={10}>
          등록된 할 일이 없습니다.
        </Text>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleTaskComplete(task.id)}
            onDelete={() => deleteTask(task.id)}
            onClick={() => handleTaskClick(task.id)}
          />
        ))
      )}
      
      <Button colorScheme="blue" variant="outline" w="full">
        + 할 일 추가하기
      </Button>
    </VStack>
  );
};