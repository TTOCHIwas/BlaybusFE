import { apiClient } from '@/shared/api/base';

export const submissionApi = {
  submit: async (taskId: string, memo: string, files: File[]) => {
    const form = new FormData();
    if (memo !== undefined) form.append('comment', memo);
    files.forEach((file) => form.append('files', file));

    return apiClient.post(`/tasks/${taskId}/submissions`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteSubmission: async (submissionId: string): Promise<void> => {
    await apiClient.delete(`/tasks/submissions/${submissionId}`);
  },
};
