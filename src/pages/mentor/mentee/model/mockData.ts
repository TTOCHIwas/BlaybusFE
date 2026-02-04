import { MenteeProfileData } from './types';

export const MOCK_MENTEE_PROFILE: MenteeProfileData = {
  id: 'mentee-1',
  name: '최연준',
  school: '서울고등학교',
  grade: '2학년',
  profileImgUrl: 'https://bit.ly/dan-abramov', 
  stats: {
    todaySubmitted: 2,
    todayRemaining: 1,
    todayFeedbackComments: 3,
    totalPlanners: 15,
  },
  achievement: {
    korean: 72,
    english: 88,
    math: 45,
  },
};