import React from 'react';
import { Box, Button, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { SubjectSection } from './SubjectSection';
import { WeaknessSelectBox } from './WeaknessSelectBox';
import { DaySelector } from './DaySelector';
import { LearningMaterialSection } from './LearningMaterialSection';
import { useScheduleCreateStore } from '../model/store';
import { useNavigate } from 'react-router-dom';

export const ScheduleCreateForm = () => {
    const { title, setTitle } = useScheduleCreateStore();
    const navigate = useNavigate();

    return (
        <Flex direction="column" w="full" h="full" p={8}>
            <Heading size="lg" mb={4}>일정 만들기</Heading>
            <Text color="gray.500" mb={8}>학생의 학습 성향에 맞는 과제를 설정해주세요.</Text>

            <Box flex={1} bg="white" borderRadius="lg" p={8} boxShadow="sm" overflowY="auto">
                <VStack spacing={0} align="stretch">
                    <SubjectSection />

                    <Box mb={8}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>제목</Text>
                        <Input
                            placeholder="제목을 입력하세요 (예: 독서 2지문 (2))"
                            size="lg"
                            fontSize="lg"
                            borderColor="blue.200"
                            focusBorderColor="blue.300"
                            _placeholder={{ color: 'gray.400' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Box>

                    <WeaknessSelectBox />

                    <DaySelector />

                    <LearningMaterialSection />

                    <Flex justify="flex-end" gap={3} mt={8}>
                        <Button
                            size="lg"
                            variant="outline"
                            colorScheme="gray"
                            onClick={() => navigate(-1)}
                        >
                            취소
                        </Button>
                        <Button
                            size="lg"
                            colorScheme="blue"
                            boxShadow="md"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            transition="all 0.2s"
                        >
                            저장
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Flex>
    );
};
