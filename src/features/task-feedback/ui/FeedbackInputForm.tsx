import { useState } from 'react';
import { Box, Textarea, Flex, IconButton, Image, Text, useToast } from '@chakra-ui/react';
import { AttachmentIcon, CloseIcon, ArrowForwardIcon } from '@chakra-ui/icons';

interface FeedbackInputFormProps {
  initialContent?: string;
  initialImageUrl?: string | null;
  onSave: (content: string, imageUrl: string | null) => void;
  onCancel: () => void;
}

export const FeedbackInputForm = ({ 
  initialContent = '', 
  initialImageUrl = null, 
  onSave, 
}: FeedbackInputFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [isBoldMode, setIsBoldMode] = useState(false);
  const toast = useToast();

  const toggleEmphasis = () => {
    setIsBoldMode(!isBoldMode);
    setContent(prev => prev + ' **강조** ');
  };

  const handleImageUpload = () => {
    const mockUrl = 'https://via.placeholder.com/200x150?text=Uploaded+Image';
    setImageUrl(mockUrl);
    toast({ status: 'info', title: '이미지가 첨부되었습니다 (Mock)', duration: 1000 });
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(content, imageUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Box 
      bg="white" 
      borderRadius="12px" 
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)" 
      border="1px solid" 
      borderColor="gray.100" 
      minW="300px"
      overflow="hidden"
    >
      <Box p={3}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="피드백을 입력하세요..."
          size="sm"
          variant="unstyled" 
          resize="none"
          rows={3}
          autoFocus
          p={0}
          fontSize="sm"
          lineHeight="1.5"
        />
        
        {imageUrl && (
          <Box position="relative" mt={3} display="inline-block">
            <Image 
              src={imageUrl} 
              alt="Attachment" 
              maxH="120px" 
              borderRadius="lg" 
              objectFit="cover" 
              border="1px solid"
              borderColor="gray.100"
            />
            <IconButton
              aria-label="Remove Image"
              icon={<CloseIcon boxSize={2} />}
              size="xs"
              position="absolute"
              top={1}
              right={1}
              colorScheme="blackAlpha"
              isRound
              onClick={() => setImageUrl(null)}
            />
          </Box>
        )}
      </Box>

      <Flex 
        justify="space-between" 
        align="center" 
        px={2} 
        py={2} 
        borderTop="1px solid" 
        borderColor="gray.50"
        bg="gray.50"
      >
        <Flex gap={1}>
          <IconButton
            aria-label="Upload Image"
            icon={<AttachmentIcon boxSize={4} />}
            size="sm"
            variant="ghost"
            color="gray.500"
            _hover={{ bg: 'white', color: 'blue.500', boxShadow: 'sm' }}
            onClick={handleImageUpload}
            isDisabled={!!imageUrl}
          />
          <IconButton
            aria-label="Bold"
            icon={<Text fontWeight="900" fontSize="sm" fontFamily="serif">B</Text>}
            size="sm"
            variant={isBoldMode ? 'solid' : 'ghost'}
            colorScheme={isBoldMode ? 'blue' : 'gray'}
            color={isBoldMode ? 'white' : 'gray.500'}
            _hover={{ bg: isBoldMode ? 'blue.600' : 'white', color: isBoldMode ? 'white' : 'blue.500', boxShadow: 'sm' }}
            onClick={toggleEmphasis}
          />
        </Flex>

        <IconButton
          aria-label="Save"
          icon={<ArrowForwardIcon boxSize={4} />}
          size="sm"
          colorScheme="blue"
          variant="solid"
          isRound
          isDisabled={!content.trim()}
          onClick={handleSave}
          boxShadow="sm"
        />
      </Flex>
    </Box>
  );
};