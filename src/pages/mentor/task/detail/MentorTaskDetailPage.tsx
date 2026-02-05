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
import { useRef, useState } from 'react'; // useRef, useState 추가
import { useNavigate, useParams } from 'react-router-dom';
import { ImageSlider } from './ui/ImageSlider';
import { TaskDetailHeader } from './ui/TaskDetailHeader';
import { MOCK_TASK_DETAIL_DATA } from './mockTaskDetail';
import { useAuthStore } from '@/shared/stores/authStore';

const MentorTaskDetailPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const toast = useToast(); // 토스트 알림 훅

    // 뒤로가기 경고 모달 상태 관리
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    // 저장 로딩 상태 관리
    const [isSaving, setIsSaving] = useState(false);

    const data = MOCK_TASK_DETAIL_DATA;

    const formattedImages = data.submissionImages.map((url, idx) => ({
        id: `img-${idx}`,
        imageUrl: url
    }));

    // [Logic] 나가기 핸들러 (모달에서 '나가기' 클릭 시)
    const handleExit = () => {
        onClose();
        navigate(-1); // 이전 페이지로 이동
    };

    // [Logic] 저장 핸들러
    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            // TODO: 실제 백엔드 API 연동 시 이 부분을 교체하세요.
            // 예: await api.post(`/tasks/${id}/feedback`, { ... });
            
            // API 지연 시간 시뮬레이션 (1초)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "저장되었습니다.",
                description: "피드백이 성공적으로 반영되었습니다.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top", // 잘 보이도록 상단 배치
            });
            
            // 저장 후 추가 로직 (예: 목록으로 이동할지, 페이지에 남을지 결정)
            // navigate(-1); // 저장이 완료되면 목록으로 나가려면 주석 해제
        } catch (error) {
            console.error("Save failed:", error);
            toast({
                title: "저장 실패",
                description: "잠시 후 다시 시도해주세요.",
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
                        subject={data.subject}
                        date={data.date}
                        isMentorChecked={data.isMentorChecked}
                        title={data.title}
                        supplement={data.description ? data.description.replace('보완점: ', '') : ''} 
                    />
                </Box>

                {/* Submission Viewer Section */}
                <Box>
                    <Text fontSize="18px" fontWeight="bold" mb={6} color="#333333">학습 점검하기</Text>
                    <ImageSlider 
                        images={formattedImages} 
                        taskId={id || 'temp-task-id'}
                        currentUserId={user.id} 
                        userRole={user.role}   
                    />
                </Box>

                {/* Mentee Comment Section */}
                <Box>
                    <Text fontSize="16px" fontWeight="bold" mb={4} color="#333333">남긴 메모</Text>
                    <Box
                        p={6}
                        bg="#F9FAFB"
                        borderRadius="12px"
                        minH="100px"
                    >
                        <Text color="#333333" fontSize="15px" lineHeight="1.6">
                            {data.menteeComment}
                        </Text>
                    </Box>
                </Box>

                {/* Footer Buttons */}
                <Flex justify="flex-end" gap={3} pt={8} pb={10}>
                    <Button
                        variant="outline"
                        onClick={onOpen} // 바로 navigate(-1) 하지 않고 모달 오픈
                        h="48px"
                        px={8}
                        borderColor="#E5E7EB"
                        color="#666666"
                        bg="white"
                        _hover={{ bg: 'gray.50' }}
                        isDisabled={isSaving} // 저장 중엔 취소 불가
                    >
                        취소
                    </Button>
                    <Button
                        colorScheme="blue"
                        bg="#3B82F6"
                        h="48px"
                        px={8}
                        _hover={{ bg: 'blue.600' }}
                        onClick={handleSave} // 저장 핸들러 연결
                        isLoading={isSaving} // 로딩 스피너 표시
                        loadingText="저장 중"
                    >
                        저장
                    </Button>
                </Flex>

            </VStack>

            {/* 나가기 확인 모달 (AlertDialog) */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered // 화면 중앙 정렬
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="12px">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            페이지를 나가시겠습니까?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            작성 중인 내용은 저장되지 않습니다.<br />
                            정말 나가시겠습니까?
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