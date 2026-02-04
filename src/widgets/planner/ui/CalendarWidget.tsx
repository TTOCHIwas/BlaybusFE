import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  IconButton, 
  Grid, 
  VStack, 
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { 
  parseDateFromState, 
  formatDateKey,
  getCalendarTitle,
  getWeekDays,
  getMonthGridDays,
  getPrevWeek,
  getNextWeek,
  getPrevMonth,
  getNextMonth,
  isToday
} from '@/shared/lib/date';
import { format, isSameDay, isSameMonth } from 'date-fns';

type ViewMode = 'WEEK' | 'MONTH';

export const CalendarWidget = () => {
  const { selectedDate, setSelectedDate } = usePlannerStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('WEEK');
  const [viewDate, setViewDate] = useState<Date>(parseDateFromState(selectedDate));
  
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setViewDate(parseDateFromState(selectedDate));
  }, [selectedDate]);


  const handlePrev = () => {
    setViewDate(prev => viewMode === 'WEEK' ? getPrevWeek(prev) : getPrevMonth(prev));
  };

  const handleNext = () => {
    setViewDate(prev => viewMode === 'WEEK' ? getNextWeek(prev) : getNextMonth(prev));
  };

  const handleDateClick = (date: Date) => {
    const newDateStr = formatDateKey(date);
    setSelectedDate(newDateStr);
    setViewDate(date); 
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'WEEK' ? 'MONTH' : 'WEEK');
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && viewMode === 'WEEK') {
        setViewMode('MONTH'); 
      } else if (diff < 0 && viewMode === 'MONTH') {
        setViewMode('WEEK'); 
      }
    }
    touchStartY.current = null;
  };

  const currentTitle = getCalendarTitle(viewDate, viewMode);
  const calendarDays = viewMode === 'WEEK' ? getWeekDays(viewDate) : getMonthGridDays(viewDate);
  const selectedDateObj = parseDateFromState(selectedDate);

  return (
    <Box 
      bg="white" 
      borderBottomRadius="20px" 
      boxShadow="sm"
      overflow="hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      transition="all 0.3s ease"
    >
      <Flex align="center" justify="center" pt={4} pb={2} gap={4}>
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon fontSize="24px" />}
          variant="ghost"
          size="sm"
          onClick={handlePrev}
        />
        <Text fontSize="lg" fontWeight="bold" minW="120px" textAlign="center" cursor="pointer" onClick={toggleViewMode}>
          {currentTitle}
        </Text>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon fontSize="24px" />}
          variant="ghost"
          size="sm"
          onClick={handleNext}
        />
      </Flex>

      <Grid templateColumns="repeat(7, 1fr)" mb={2} px={2}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <Text 
            key={day} 
            textAlign="center" 
            fontSize="xs" 
            color={idx === 0 ? 'red.400' : 'gray.500'}
          >
            {day}
          </Text>
        ))}
      </Grid>

      <Box 
        px={2} 
        pb={2}
        transition="height 0.3s ease"
      >
        <Grid 
          templateColumns="repeat(7, 1fr)" 
          rowGap={viewMode === 'MONTH' ? 2 : 0}
        >
          {calendarDays.map((date) => {
            const isSelected = isSameDay(date, selectedDateObj);
            const isTodayDate = isToday(formatDateKey(date));
            const isCurrentMonth = isSameMonth(date, viewDate);
            
            const opacity = (viewMode === 'MONTH' && !isCurrentMonth) ? 0.3 : 1;

            return (
              <VStack 
                key={date.toISOString()} 
                spacing={1} 
                onClick={() => handleDateClick(date)}
                cursor="pointer"
                opacity={opacity}
                py={1}
              >
                <Flex
                  align="center"
                  justify="center"
                  w="36px"
                  h="36px"
                  borderRadius="full"
                  bg={isSelected ? 'blue.500' : 'transparent'}
                  color={isSelected ? 'white' : 'gray.800'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  position="relative"
                >
                  <Text fontSize="sm">{format(date, 'd')}</Text>
                  
                  {isTodayDate && !isSelected && (
                    <Box 
                      position="absolute" 
                      bottom="4px" 
                      w="4px" 
                      h="4px" 
                      bg="blue.500" 
                      borderRadius="full" 
                    />
                  )}
                </Flex>
              </VStack>
            );
          })}
        </Grid>
      </Box>

      <Flex 
        justify="center" 
        align="center" 
        h="24px" 
        cursor="pointer" 
        onClick={toggleViewMode}
        bg="gray.50"
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <Box 
          w="40px" 
          h="4px" 
          bg="gray.300" 
          borderRadius="full" 
        />
      </Flex>
    </Box>
  );
};