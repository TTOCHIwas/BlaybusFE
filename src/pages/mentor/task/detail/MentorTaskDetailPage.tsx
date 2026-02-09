import { 
    Box, 
    Button, 
    Container, 
    Flex, 
    Text, 
    VStack, 
    useDisclosure, 
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { format, parse } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { ImageSlider, TaskDetailHeader } from '@/widgets/task-detail';
import { ResourceSlider, StudyMaterial } from '@/widgets/task-detail/ResourceSlider';
import { Subject } from '@/widgets/task-detail/TaskDetailHeader';
import { useTaskDetail } from '@/features/task/model/useTaskDetail';
import { taskApi } from '@/features/task/api/taskApi';

const formatTaskDate = (value?: string) => {
    if (!value) return '';
    const datePart = value.split('T')[0];
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
        ? parse(datePart, 'yyyy-MM-dd', new Date())
        : new Date(value);
    return format(parsed, 'yyyy\ub144 M\uc6d4 d\uc77c');
};


const MentorTaskDetailPage = () => {
    const { taskId } = useParams<{ taskId: string }>(); 
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const toast = useToast(); 

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const [isSaving, setIsSaving] = useState(false);
    const { data, setData } = useTaskDetail(taskId);
    const effectiveTaskId = taskId ?? data?.id;

    const submissionImages = data?.submission?.images ?? [];
    const submissionImageIds = data?.submission?.imageIds ?? [];
    const formattedImages = submissionImages.map((url, idx) => ({
        id: submissionImageIds[idx] ?? `img-${idx}`,
        imageUrl: url
    }));
    const hasSubmission = Boolean(data?.submission);
    const submissionStatus = hasSubmission ? '제출됨' : '미제출';

    const studyMaterials: StudyMaterial[] = [];
    if (data?.weakness?.file) {
        studyMaterials.push({
            id: 'weakness-file',
            title: data.weakness.file.title,
            url: data.weakness.file.url,
            label: data.weakness.title,
        });
    }
    if (data?.taskFile) {
        studyMaterials.push({
            id: 'task-file',
            title: data.taskFile.title,
            url: data.taskFile.url,
            label: 'Task File',
        });
    }

    const taskDateLabel = formatTaskDate(data?.taskDate);

    const handleExit = () => {
        onClose();
        navigate(-1);
    };

    const handleBackToList = () => {
        navigate(-1);
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            if (!effectiveTaskId) return;
            await taskApi.confirmMentorTask(effectiveTaskId);
            setData((prev) => (prev ? { ...prev, isMentorChecked: true } : prev));

            toast({
                title: "Saved.",
                description: "Feedback confirmation saved.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top", 
            });
            
        } catch (error) {
            console.error("Save failed:", error);
            toast({
                title: "Save failed",
                description: "Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <Container maxW="container.lg" py={12} bg="white" minH="100vh">
            <VStack spacing={10} align="stretch" maxW="1000px" mx="auto">
                {/* Header Section */}
                <Box>
                    <TaskDetailHeader
                        subject={(data?.subject ?? 'OTHER') as Subject}
                        date={taskDateLabel}
                        isMentorChecked={Boolean(data?.isMentorChecked)}
                        title={data?.title ?? ''}
                        supplement={data?.description ?? ''} 
                        statusLabel="제출 상태"
                        statusText={submissionStatus}
                    />
                </Box>

                {hasSubmission ? (
                    <>
                        {/* Submission Viewer Section */}
                        <Box>
                            <Text fontSize="18px" fontWeight="bold" mb={6} color="#333333">제출물 검토</Text>
                            <ImageSlider 
                                images={formattedImages} 
                                taskId={effectiveTaskId || 'temp-task-id'}
                                currentUserId={user.id} 
                                userRole={user.role}   
                            />
                        </Box>

                        {/* Mentee Comment Section */}
                        <Box pt={16}>
                            <Text fontSize="16px" fontWeight="bold" mb={4} color="#333333">남긴 메모</Text>
                            <Box
                                p={6}
                                bg="#F9FAFB"
                                borderRadius="12px"
                                minH="100px"
                            >
                                <Text color="#333333" fontSize="15px" lineHeight="1.6">
                                    {data?.submission?.memo ?? ''}
                                </Text>
                            </Box>
                        </Box>

                        {/* Footer Buttons */}
                        <Flex justify="flex-end" gap={3} pt={8} pb={10}>
                            <Button
                                variant="outline"
                                onClick={onOpen}
                                h="48px"
                                px={8}
                                borderColor="#E5E7EB"
                                color="#666666"
                                bg="white"
                                _hover={{ bg: 'gray.50' }}
                                isDisabled={isSaving}
                            >
                                취소
                            </Button>
                            <Button
                                colorScheme="blue"
                                bg="#3B82F6"
                                h="48px"
                                px={8}
                                _hover={{ bg: 'blue.600' }}
                                onClick={handleSave} 
                                isLoading={isSaving} 
                                loadingText="저장중..."
                            >
                                저장
                            </Button>
                        </Flex>
                    </>
                ) : (
                    <>
                        <Box>
                            <Text fontSize="18px" fontWeight="bold" mb={6} color="#333333">학습자료</Text>

                            {studyMaterials.length > 0 ? (
                                <VStack spacing={8} align="stretch">
                                    {studyMaterials.map((material) => (
                                        <Box key={material.id}>
                                            <ResourceSlider materials={[material]} />
                                        </Box>
                                    ))}
                                </VStack>
                            ) : (
                                <Box py={10} textAlign="center" bg="gray.50" borderRadius="xl" color="gray.500">
                                    등록된 학습 자료가 없습니다.
                                </Box>
                            )}
                        </Box>

                        <Flex justify="center" pt={8} pb={10}>
                            <Button size="lg" w="200px" h="52px" onClick={handleBackToList}>
                                목록으로
                            </Button>
                        </Flex>
                    </>
                )}

            </VStack>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered 
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="12px">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            페이지에 남겠습니까?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            수정 사항이 저장되지 않습니다.<br />
                            정말 나가겠습니까?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                취소
                            </Button>
                            <Button colorScheme="red" onClick={handleExit} ml={3}>
                                나가기
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
};

export default MentorTaskDetailPage;






