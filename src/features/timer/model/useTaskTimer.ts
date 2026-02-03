import { useState, useEffect, useCallback } from 'react';
import { useTimerStore } from '@/shared/stores/timerStore';
import { usePlannerStore } from '@/shared/stores/plannerStore';
import { formatElapsedTime } from './timerUtils';
import { getCurrentTimeString } from '@/shared/lib/date';
import { Subject } from '@/shared/constants/subjects';

export const useTaskTimer = (taskId: string, subject: Subject) => {
  const { 
    activeTaskId, 
    taskTimers, 
    startTimer, 
    stopTimer, 
  } = useTimerStore();
  
  const { addStudyTimeSlot } = usePlannerStore();
  
  const [displayTime, setDisplayTime] = useState('00:00:00');
  
  const timerData = taskTimers[taskId];
  const isRunning = activeTaskId === taskId && !!timerData?.timerStartedAt;

  // 타이머 UI 업데이트 (1초 간격)
  useEffect(() => {
    if (!isRunning) {
      const elapsed = timerData?.elapsedTime || 0;
      setDisplayTime(formatElapsedTime(elapsed));
      return;
    }

    const updateDisplay = () => {
      const now = Date.now();
      const elapsed = timerData.elapsedTime + (now - timerData.timerStartedAt!);
      setDisplayTime(formatElapsedTime(elapsed));
    };

    updateDisplay();
    const intervalId = setInterval(updateDisplay, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timerData]);

  // 시작/정지 토글
  const toggle = useCallback(() => {
    if (isRunning) {
      // 정지 시: 그리드에 기록 저장
      const endTime = getCurrentTimeString();
      const startTime = timerData.startTimeOfDay || endTime;
      
      addStudyTimeSlot({
        startTime,
        endTime,
        subject,
        taskId
      });
      
      stopTimer(taskId);
    } else {
      startTimer(taskId);
    }
  }, [isRunning, taskId, subject, timerData, startTimer, stopTimer, addStudyTimeSlot]);

  return {
    displayTime,
    isRunning,
    toggle,
    elapsedTime: timerData?.elapsedTime || 0,
  };
};