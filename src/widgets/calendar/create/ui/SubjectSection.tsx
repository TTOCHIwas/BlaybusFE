import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useScheduleCreateStore } from '../model/store';
import { Subject } from '../model/types';

export const SubjectSection = () => {
    const { subject, isWeaknessSelected, setSubject, toggleWeakness } = useScheduleCreateStore();

    const subjects: { label: string; value: Subject; colorScheme: string }[] = [
        { label: '국어', value: 'KOREAN', colorScheme: 'blue' },
        { label: '영어', value: 'ENGLISH', colorScheme: 'purple' },
        { label: '수학', value: 'MATH', colorScheme: 'orange' },
    ];

    return (
        <Box mb={8}>
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>과목</Text>
            <HStack spacing={2}>
                {subjects.map((sub) => (
                    <Button
                        key={sub.value}
                        onClick={() => setSubject(sub.value)}
                        colorScheme={sub.colorScheme}
                        variant={subject === sub.value ? 'solid' : 'outline'}
                        size="md"
                        borderRadius="lg"
                    >
                        {sub.label}
                    </Button>
                ))}

                <Button
                    onClick={toggleWeakness}
                    colorScheme="blue"
                    variant={isWeaknessSelected ? 'solid' : 'outline'}
                    size="md"
                    borderRadius="lg"
                    ml={2}
                >
                    보완점
                </Button>
            </HStack>
        </Box>
    );
};
