export interface Answer {
  id: string;
  comment: string;
  userId: string;
  feedbackId: string;       
  createdAt: string;        
}

export const mapAnswerFromApi = (raw: any): Answer => ({
  id: String(raw.id),
  comment: raw.comment,
  userId: String(raw.userId),
  feedbackId: String(raw.feedbackId),
  createdAt: raw.created_at,
});