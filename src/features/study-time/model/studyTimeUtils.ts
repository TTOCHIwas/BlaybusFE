import { Subject } from '@/shared/constants/subjects';
import { StudyTimeSlot } from '@/entities/study-time/types';
import { 
  SLOTS_PER_HOUR, 
  MINUTES_PER_SLOT, 
  DAY_START_HOUR,
  TOTAL_SLOTS 
} from '@/shared/constants/studyTime';

// HH:mm -> Index (04:00 기준)
export const timeToAdjustedIndex = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  
  // 04시 이전이면 24를 더해서 계산 (예: 02:00 -> 26:00)
  const adjustedHour = hour < DAY_START_HOUR ? hour + 24 : hour;
  const hourOffset = adjustedHour - DAY_START_HOUR;
  
  return hourOffset * SLOTS_PER_HOUR + Math.floor(minute / MINUTES_PER_SLOT);
};

export const slotsToGridState = (slots: StudyTimeSlot[]): (Subject | null)[] => {
  const grid: (Subject | null)[] = Array(TOTAL_SLOTS).fill(null);
  
  slots.forEach((slot) => {
    const startIdx = timeToAdjustedIndex(slot.startTime);
    const endIdx = timeToAdjustedIndex(slot.endTime);
    
    for (let i = startIdx; i < endIdx && i < TOTAL_SLOTS; i++) {
      grid[i] = slot.subject;
    }
  });
  
  return grid;
};

export const calculateTotalMinutes = (grid: (Subject | null)[]): number => {
  return grid.filter(s => s !== null).length * MINUTES_PER_SLOT;
};

export const formatMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};