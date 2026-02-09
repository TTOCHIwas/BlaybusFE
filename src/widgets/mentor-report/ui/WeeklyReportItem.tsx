import { Flex, Text, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface Props {
  weekNumber: number;
  displayMonth: number;
  displayRange: string;
  status: 'PAST' | 'CURRENT' | 'FUTURE';
  hasReport: boolean;
  isMentor?: boolean;
  onClick: () => void;
}

export const WeeklyReportItem = ({
  weekNumber,
  displayRange,
  status,
  hasReport,
  isMentor = false,
  onClick,
}: Props) => {
  const isFuture = status === 'FUTURE';
  const isCurrent = status === 'CURRENT';
  const isDisabled = isMentor ? isFuture : isFuture || !hasReport;
  const isHighlighted = isMentor ? isCurrent : isCurrent && hasReport;

  return (
    <Flex
      align="center"
      justify="space-between"
      p={{base:("6px 24px"), md:("12px 16px")}}
      borderRadius="7"
      transition="all 0.2s"
      role="group"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      onClick={isDisabled ? undefined : onClick}
      bg={isDisabled ? 'none' : isHighlighted ? '#DCEAFF' : '#EDF3FF'}
      color={isDisabled ? '#939497ff' : '#373E56'}
      _hover={!isDisabled ? {
        bg: 'gray.100',
      } : undefined}
    >
      <Flex gap={{base:12, md:'20'}}>
        <Text
          fontSize={{base:"sm",md:"xl"}}
          fontWeight="600"
        >
          {weekNumber}주차
        </Text>

        <Text fontSize={{base:"sm",md:"xl"}} fontWeight="bold">
          {displayRange}
        </Text>
      </Flex>


        {!isDisabled && (
          <Icon
            as={ChevronRightIcon}
            w={5} h={5}
            color="gray.400"
          />
        )}
    </Flex>
  );
};
