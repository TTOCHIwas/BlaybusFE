import { format, subDays } from 'date-fns';
import { DAY_START_HOUR } from '@/shared/constants/studyTime';

export const getAdjustedDate = (): string => {
  const now = new Date();
  if (now.getHours() < DAY_START_HOUR) {
    return format(subDays(now, 1), 'yyyy-MM-dd');
  }
  return format(now, 'yyyy-MM-dd');
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};