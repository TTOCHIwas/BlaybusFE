import { format, subDays } from 'date-fns';
import { DAY_START_HOUR } from '@/shared/constants/studyTime';

export const getAdjustedDate = (): string => {
  const now = new Date();
  if (now.getHours() < DAY_START_HOUR) {
    return format(subDays(now, 1), 'yyyy-MM-dd');
  }
  return format(now, 'yyyy-MM-dd');
};

export const getCurrentTimeISO = (): string => {
  return new Date().toISOString();
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
};