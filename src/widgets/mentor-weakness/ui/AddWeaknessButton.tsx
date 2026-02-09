import { Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

interface Props {
  onClick: () => void;
  isDisabled?: boolean;
}

export const AddWeaknessButton = ({ onClick, isDisabled = false }: Props) => {
  return (
    <Flex
      bg="#F9F9FB"
      borderRadius="22px"
      align="center"
      justify="center"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      transition="all 0.2s"
      _hover={isDisabled ? undefined : { bg: 'gray.100' }}
      color="#A0A5B1"
      opacity={isDisabled ? 0.6 : 1}
      onClick={isDisabled ? undefined : onClick}
      h="72px"
    >
      <AddIcon w={4} h={4} />
    </Flex>
  );
};
