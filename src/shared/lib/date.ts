import { 
  format, 
  subDays, 
  isBefore, 
  isAfter, 
  startOfDay, 
  startOfWeek, 
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks, 
  subWeeks, 
  addMonths,
  subMonths,
  addDays, 
  differenceInCalendarWeeks,
  getMonth
} from 'date-fns';
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

export const parseDurationToSeconds = (value?: string | null): number | null => {
  if (!value) return null;
  const parts = value.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return null;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return null;
};

export const isToday = (dateString: string): boolean => {
  return dateString === getAdjustedDate();
};

export const isPastDate = (dateString: string): boolean => {
  const today = startOfDay(new Date(getAdjustedDate()));
  const target = startOfDay(new Date(dateString));
  return isBefore(target, today);
};

export const isFutureDate = (dateString: string): boolean => {
  const today = startOfDay(new Date(getAdjustedDate()));
  const target = startOfDay(new Date(dateString));
  return isAfter(target, today);
};

export const canAddTask = (dateString: string): boolean => {
  return !isPastDate(dateString);
};

export const canUseTimer = (dateString: string): boolean => {
  return isToday(dateString);
};

export const parseDateFromState = (dateString: string): Date => {
  return new Date(dateString); 
};

export const formatDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getWeekInfoText = (date: Date): string => {
  const month = getMonth(date) + 1;
  const startMonth = startOfMonth(date);
  const weekNumber = differenceInCalendarWeeks(date, startMonth, { weekStartsOn: 0 }) + 1; 
  return `${month}월 ${weekNumber}주차`;
};

export const getCalendarTitle = (date: Date, mode: 'WEEK' | 'MONTH'): string => {
  if (mode === 'MONTH') {
    const year = format(date, 'yyyy');
    const month = getMonth(date) + 1;
    return `${year}년 ${month}월`;
  }
  return getWeekInfoText(date);
};

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 }); 
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const getMonthGridDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = startDate;

  while (day <= endDate || days.length % 7 !== 0) {
    days.push(day);
    day = addDays(day, 1);
  }
  
  return days;
};

export const getNextWeek = (date: Date) => addWeeks(date, 1);
export const getPrevWeek = (date: Date) => subWeeks(date, 1);
export const getNextMonth = (date: Date) => addMonths(date, 1);
export const getPrevMonth = (date: Date) => subMonths(date, 1);
