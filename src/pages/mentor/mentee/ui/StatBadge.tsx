import { Flex, Text } from '@chakra-ui/react';

interface Props {
  label: string;
  value: number; 
}

export const StatBadge = ({ label, value }: Props) => {
  return (
    <Flex 
      align="center" 
      gap={2}
      minW="max-content" 
    >
      <Text 
        fontSize="md" 
        fontWeight="bold" 
        color="gray.600" 
        whiteSpace="nowrap" 
      >
        {label}
      </Text>
      
      <Flex
        padding="1px 12px"
        bg="#373E56"
        borderRadius="full"
        align="center"
        justify="center"
        flexShrink={0} 
      >
        <Text color="white" fontWeight="semibold" fontSize="16px">
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};