import { apiClient } from '@/shared/api/base';
import type { MenteeNavItem } from '@/widgets/main-layout/desktop/components/MenteeMenuItem';
import { asArray, asRecord, asString, pick } from '@/shared/api/parse';

const normalizeMentee = (raw: unknown): MenteeNavItem => {
  const obj = asRecord(raw, 'MenteeNavItem');
  return {
    id: asString(pick(obj, ['menteeId', 'id']), 'MenteeNavItem.id'),
    name: asString(pick(obj, ['name', 'menteeName']), 'MenteeNavItem.name'),
  };
};

export const mentoringApi = {
  listMentees: async (params?: { page?: number; size?: number }): Promise<MenteeNavItem[]> => {
    const data = await apiClient.get('/mentor/mentees', { params });
    const obj = asRecord(data, 'MenteeNavList');
    const list = Array.isArray(data)
      ? data
      : asArray(pick(obj, ['content', 'mentees']), 'MenteeNavList.list');
    return list.map(normalizeMentee);
  },
};
