import { Box, Text, Flex } from '@chakra-ui/react';
import { StudyTimeSlot } from '@/entities/study-time/types';
import { 
  SUBJECT_COLORS, 
  TOTAL_HOURS, 
  SLOTS_PER_HOUR,
  DAY_START_HOUR 
} from '@/shared/constants/studyTime';
import { formatMinutes, slotsToGridState, calculateTotalMinutes } from '../model/studyTimeUtils';

interface Props {
  slots: StudyTimeSlot[];
}

export const StudyTimeGrid = ({ slots }: Props) => {
  const gridState = slotsToGridState(slots);
  const totalMinutes = calculateTotalMinutes(gridState);

  // 04시부터 시작하는 24시간 배열
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const hour = (DAY_START_HOUR + i) % 24;
    return hour;
  });

  return (
    <Box userSelect="none">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" fontWeight="bold" color="gray.600">
          총 {formatMinutes(totalMinutes)}
        </Text>
      </Flex>

      <Box 
        border="1px solid" 
        borderColor="gray.200" 
        borderRadius="md" 
        overflow="hidden"
      >
        {hours.map((hour, hourIndex) => (
          <Flex key={hourIndex} borderBottom="1px solid" borderColor="gray.100" height="32px">
            <Flex 
              w="50px" 
              justify="center" 
              align="center" 
              bg="gray.50" 
              borderRight="1px solid" 
              borderColor="gray.100"
              fontSize="xs"
              color="gray.500"
            >
              {String(hour).padStart(2, '0')}:00
            </Flex>

            <Flex flex={1}>
              {Array.from({ length: SLOTS_PER_HOUR }, (_, slotIdx) => {
                const globalIndex = hourIndex * SLOTS_PER_HOUR + slotIdx;
                const subject = gridState[globalIndex];
                const colors = subject ? SUBJECT_COLORS[subject] : null;

                return (
                  <Box
                    key={slotIdx}
                    flex={1}
                    borderRight={slotIdx !== 5 ? "1px dashed" : "none"}
                    borderColor="gray.100"
                    bg={colors ? colors.bg : 'white'}
                  />
                );
              })}
            </Flex>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};