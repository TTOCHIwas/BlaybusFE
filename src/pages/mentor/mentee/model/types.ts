export interface MenteeProfileData {
  id: string;
  name: string;
  school: string;
  grade: string;
  profileImgUrl?: string | null;

  stats: {
    todaySubmitted: number;
    todayRemaining: number;
    todayFeedbackComments: number;
    totalPlanners: number;
  };
  
  achievement: {
    korean: number;
    english: number;
    math: number;
  };
}