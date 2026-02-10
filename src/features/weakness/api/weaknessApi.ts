import { apiClient } from '@/shared/api/base';
import type { Weakness } from '@/entities/weakness/types';
import { mapWeaknessFromApi } from '@/entities/weakness/types';
import { asArray, asRecord, pick } from '@/shared/api/parse';
import type { Subject } from '@/shared/constants/subjects';

export const weaknessApi = {
  listByMentee: async (menteeId: string): Promise<Weakness[]> => {
    const data = await apiClient.get(`/mentor/weakness/${menteeId}`);
    const list = Array.isArray(data)
      ? data
      : asArray(pick(asRecord(data, 'WeaknessList'), ['content']), 'WeaknessList.content');
    return list.map(mapWeaknessFromApi);
  },

  listMine: async (): Promise<Weakness[]> => {
    const data = await apiClient.get('/mentee/weakness/me');
    const list = Array.isArray(data)
      ? data
      : asArray(pick(asRecord(data, 'WeaknessList'), ['content']), 'WeaknessList.content');
    return list.map(mapWeaknessFromApi);
  },

  create: async (payload: {
    menteeId: string;
    subject: Subject;
    title: string;
    contentId?: string | number;
  }): Promise<Weakness> => {
    const data = await apiClient.post('/mentor/weakness', payload);
    if (typeof data === 'number' || typeof data === 'string') {
      return {
        id: String(data),
        title: payload.title,
        inforId: '',
        contentId: payload.contentId ? String(payload.contentId) : '',
        menteeId: payload.menteeId,
        subject: payload.subject,
      };
    }
    return mapWeaknessFromApi(data);
  },

  remove: async (weaknessId: string): Promise<void> => {
    await apiClient.delete(`/mentor/weakness/${weaknessId}`);
  },
};
