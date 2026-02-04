import { Task } from '@/entities/task/types';
import { TaskLog } from '@/entities/task-log/types';
import { getAdjustedDate } from '@/shared/lib/date';

const TODAY = getAdjustedDate();

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '비문학 3지문 풀이',
    subject: 'KOREAN',
    status: 'PENDING',
    taskDate: TODAY,
    isMandatory: true,
    isMentorChecked: false,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
  {
    id: 'task-2',
    title: '미적분 문제 20번',
    subject: 'MATH',
    status: 'COMPLETED',
    taskDate: TODAY,
    isMandatory: true,
    isMentorChecked: false,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
  {
    id: 'task-3',
    title: '영단어 50개 암기',
    subject: 'ENGLISH',
    status: 'IN_PROGRESS',
    taskDate: TODAY,
    isMandatory: false,
    isMentorChecked: false,
    menteeId: 'mentee-1',
    recurringGroupId: null,
    contentId: null,
    weaknessId: null,
  },
];

export const MOCK_TASK_LOGS: TaskLog[] = [
  { 
    id: 'log-1',
    startAt: `${TODAY}T09:00:00`, 
    endAt: `${TODAY}T10:30:00`, 
    duration: 5400,
    taskId: 'task-1'
  },
];