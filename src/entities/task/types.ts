import { Subject } from '@/shared/constants/subjects';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  subject: Subject;
  title: string;
  status: TaskStatus;
  taskDate: string;               
  isMandatory: boolean;         
  isMentorChecked: boolean;
  menteeId: string;
  recurringGroupId: string | null;
  contentId: string | null;
  weaknessId: string | null;
}