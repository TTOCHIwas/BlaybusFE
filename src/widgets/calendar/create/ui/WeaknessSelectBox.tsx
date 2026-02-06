import { Box, Select, Text } from '@chakra-ui/react';
import { useScheduleCreateStore } from '../model/store';
import { MOCK_WEAKNESSES } from '../model/mockData';

export const WeaknessSelectBox = () => {
    const { subject, isWeaknessSelected, selectedWeaknessId, setSelectedWeaknessId } = useScheduleCreateStore();

    // Show only if both a subject is selected AND weakness mode is toggled on
    if (!subject || !isWeaknessSelected) return null;

    const filteredWeaknesses = MOCK_WEAKNESSES.filter((w) => w.subject === subject);

    return (
        <Box mb={8} animation="fadeIn 0.3s">
            <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={3}>보완점</Text>
            <Box w="full">
                <Select
                    value={selectedWeaknessId || ''}
                    onChange={(e) => setSelectedWeaknessId(e.target.value)}
                    placeholder="보완점 강의/오답노트 선택"
                    bg="white"
                    borderColor="pink.200"
                    focusBorderColor="pink.300"
                    size="md"
                    borderRadius="lg"
                >
                    {filteredWeaknesses.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.label}
                        </option>
                    ))}
                </Select>
                {filteredWeaknesses.length === 0 && (
                    <Text fontSize="sm" color="gray.500" mt={2}>해당 과목에 등록된 보완점 자료가 없습니다.</Text>
                )}
            </Box>
        </Box>
    );
};
