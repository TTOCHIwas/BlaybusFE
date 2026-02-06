import { Box, Button, Select, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useScheduleCreateStore } from '../model/store';
import { DAYS, WEEKS } from '../model/mockData';

export const DaySelector = () => {
    const { selectedWeek, setSelectedWeek, selectedDays, toggleDay } = useScheduleCreateStore();

    return (
        <Box mb={8}>
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>요일 선택</Text>
            <Wrap spacing={2} align="center">
                {/* Week Selector */}
                <WrapItem>
                    <Select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        bg="white"
                        borderColor="blue.200"
                        focusBorderColor="blue.100"
                        width="120px"
                        borderRadius="lg"
                    >
                        {WEEKS.map((week) => (
                            <option key={week} value={week}>{week}</option>
                        ))}
                    </Select>
                </WrapItem>

                {/* Day Toggles */}
                {DAYS.map((day) => (
                    <WrapItem key={day.value}>
                        <Button
                            onClick={() => toggleDay(day.value)}
                            w="10"
                            h="10"
                            borderRadius="lg"
                            p={0}
                            colorScheme="blue"
                            variant={selectedDays.includes(day.value) ? 'solid' : 'outline'}
                            bg={selectedDays.includes(day.value) ? 'blue.400' : 'white'}
                            color={selectedDays.includes(day.value) ? 'white' : 'gray.400'}
                            borderColor={selectedDays.includes(day.value) ? 'blue.400' : 'gray.200'}
                            _hover={{
                                borderColor: selectedDays.includes(day.value) ? 'blue.500' : 'gray.300',
                                bg: selectedDays.includes(day.value) ? 'blue.500' : 'gray.50'
                            }}
                        >
                            {day.label}
                        </Button>
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
};
