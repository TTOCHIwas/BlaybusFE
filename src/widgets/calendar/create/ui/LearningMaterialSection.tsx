import { Box, Button, Flex, Icon, Input, Text, VStack, useToast } from '@chakra-ui/react';
import React from 'react';
import { useScheduleCreateStore } from '../model/store';
import { DAYS } from '../model/mockData';
import { CheckCircleIcon, SmallCloseIcon, AttachmentIcon, AddIcon } from '@chakra-ui/icons';

export const LearningMaterialSection = () => {
    const { selectedDays, materialsByDay, setMaterialForDay } = useScheduleCreateStore();

    // Sort selected days to match the order in DAYS (e.g., Mon -> Sun)
    const sortedSelectedDays = DAYS.filter((day) => selectedDays.includes(day.value));

    const handleFileChange = (dayValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setMaterialForDay(dayValue, {
                fullPath: '', // In a real scenario, this would be a URL
                name: file.name,
                size: file.size,
            });
        }
    };

    const handleRemoveFile = (dayValue: string) => {
        setMaterialForDay(dayValue, null);
    };

    if (sortedSelectedDays.length === 0) {
        return null;
    }

    return (
        <Box mb={8} animation="fadeIn 0.3s">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>학습지</Text>
            <VStack spacing={3} align="stretch">
                {sortedSelectedDays.map((day) => {
                    const material = materialsByDay[day.value];

                    return (
                        <Flex key={day.value} align="center" gap={3}>
                            <Flex
                                w="12"
                                h="12"
                                borderRadius="lg"
                                bg="blue.50"
                                color="blue.500"
                                fontWeight="bold"
                                align="center"
                                justify="center"
                                shrink={0}
                            >
                                {day.label}
                            </Flex>

                            <Box flex={1}>
                                {material ? (
                                    <Flex
                                        align="center"
                                        justify="space-between"
                                        px={4}
                                        py={3}
                                        bg="white"
                                        border="1px"
                                        borderColor="blue.200"
                                        borderRadius="lg"
                                    >
                                        <Flex align="center" gap={2} overflow="hidden">
                                            <Icon as={CheckCircleIcon} color="blue.500" />
                                            <Text color="gray.900" isTruncated>{material.name}</Text>
                                        </Flex>
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            colorScheme="red"
                                            onClick={() => handleRemoveFile(day.value)}
                                        >
                                            <Icon as={SmallCloseIcon} w={5} h={5} />
                                        </Button>
                                    </Flex>
                                ) : (
                                    <Box position="relative" width="full">
                                        <Input
                                            type="file"
                                            id={`file-${day.value}`}
                                            display="none"
                                            onChange={(e) => handleFileChange(day.value, e)}
                                        />
                                        <label htmlFor={`file-${day.value}`} style={{ width: '100%' }}>
                                            <Flex
                                                align="center"
                                                justify="center"
                                                w="full"
                                                px={4}
                                                py={3}
                                                bg="gray.50"
                                                border="2px dashed"
                                                borderColor="gray.300"
                                                borderRadius="lg"
                                                color="gray.500"
                                                cursor="pointer"
                                                transition="all 0.2s"
                                                _hover={{
                                                    bg: 'blue.50',
                                                    borderColor: 'blue.400',
                                                    color: 'blue.500'
                                                }}
                                            >
                                                <Icon as={AddIcon} w={4} h={4} mr={2} />
                                                <Text fontWeight="medium">학습지 업로드</Text>
                                            </Flex>
                                        </label>
                                    </Box>
                                )}
                            </Box>
                        </Flex>
                    );
                })}
            </VStack>
        </Box>
    );
};
