import { Box, Flex, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

interface Props {
  label: string;
  value: number;
  colorScheme: string; 
}

const COLOR_MAP: Record<string, string> = {
  blue: '#3182CE', 
  green: '#38A169', 
  purple: '#805AD5',
};

export const AchievementDonut = ({ label, value, colorScheme }: Props) => {
  const colorCode = COLOR_MAP[colorScheme] || '#718096';

  return (
    <Box position="relative" display="flex" flexDirection="column" alignItems="center">
      <Flex
        bg={colorCode}
        color="white"
        w="66px"
        h="38px"
        align="center"
        justify="center"
        borderRadius="md"
        mb={3} 
        position="relative"
        fontSize="sm"
        fontWeight="bold"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '6px 6px 0',
          borderStyle: 'solid',
          borderColor: `${colorCode} transparent transparent transparent`,
        }}
      >
        {label}
      </Flex>

      <CircularProgress
        value={value}
        size="122px" 
        thickness="8px" 
        color={colorScheme + '.500'}
        trackColor="gray.100"
        capIsRound
      >
        <CircularProgressLabel fontSize="2xl" fontWeight="bold" color={colorCode}>
          {value}%
        </CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
};