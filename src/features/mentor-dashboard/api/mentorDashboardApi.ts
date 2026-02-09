import { menteeDashboardApi } from '@/features/mentee-dashboard/api/menteeDashboardApi';
import { mentoringApi } from '@/features/mentoring/api/mentoringApi';
import type {
  DashboardStats,
  MenteeSummary,
  RecentSubmittedTask,
  RecentFeedbackComment,
} from '@/pages/mentor/mypage/model/types';
import type { MenteeProfileData } from '@/widgets/mentee-profile/model/types';

export interface MentorDashboardData {
  stats: DashboardStats;
  mentees: MenteeSummary[];
  recentTasks: RecentSubmittedTask[];
  recentComments: RecentFeedbackComment[];
}

const DEFAULT_STATS: DashboardStats = {
  uncheckedTaskCount: 0,
  pendingFeedbackCount: 0,
};

const parseGrade = (value?: string): number | undefined => {
  if (!value) return undefined;
  const match = value.match(/\d+/);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toMenteeSummary = (profile: MenteeProfileData, fallbackName?: string): MenteeSummary => ({
  id: profile.id,
  name: profile.name || fallbackName || '',
  profileImgUrl: profile.profileImgUrl ?? null,
  achievement: profile.achievement,
  school: profile.school || undefined,
  grade: parseGrade(profile.grade),
  lastActiveAt: null,
});

const toFallbackSummary = (mentee: { id: string; name: string }): MenteeSummary => ({
  id: mentee.id,
  name: mentee.name,
  profileImgUrl: null,
  achievement: { korean: 0, english: 0, math: 0 },
  school: undefined,
  grade: undefined,
  lastActiveAt: null,
});

export const mentorDashboardApi = {
  get: async (): Promise<MentorDashboardData> => {
    // Backend spec does not expose /mentor/dashboard. Build a minimal dashboard from existing endpoints.
    const mentees = await mentoringApi.listMentees({ page: 0, size: 20 });
    if (mentees.length === 0) {
      return {
        stats: DEFAULT_STATS,
        mentees: [],
        recentTasks: [],
        recentComments: [],
      };
    }

    const results = await Promise.allSettled(
      mentees.map((mentee) => menteeDashboardApi.getByMenteeId(mentee.id))
    );

    return {
      stats: DEFAULT_STATS,
      mentees: results.map((result, index) => {
        const mentee = mentees[index];
        if (result.status === 'fulfilled') {
          return toMenteeSummary(result.value, mentee.name);
        }
        return toFallbackSummary(mentee);
      }),
      recentTasks: [],
      recentComments: [],
    };
  },
};
