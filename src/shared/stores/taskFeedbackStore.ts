import { create } from 'zustand';
import type { TaskFeedback } from '@/entities/task-feedback/types';
import type { Answer } from '@/entities/answer/types';
import type { 
  FeedbacksByImage, 
  AnswersByFeedback, 
  CommentMode 
} from '@/features/task-feedback/model/types';

interface PendingPosition {
  x: number;
  y: number;
}

interface TaskFeedbackState {
  // 데이터
  feedbacksByImage: FeedbacksByImage;
  answersByFeedback: AnswersByFeedback;
  
  // UI 상태
  commentMode: CommentMode;
  activeFeedbackId: string | null;
  pendingPosition: PendingPosition | null;
  currentImageId: string | null;
  
  // UI 액션
  setCommentMode: (mode: CommentMode) => void;
  setActiveFeedback: (id: string | null) => void;
  setPendingPosition: (pos: PendingPosition | null) => void;
  setCurrentImageId: (imageId: string | null) => void;
  resetUIState: () => void;
  
  // 피드백 CRUD
  loadFeedbacks: (feedbacks: TaskFeedback[]) => void;
  addFeedback: (feedback: TaskFeedback) => void;
  updateFeedback: (id: string, updates: Partial<TaskFeedback>) => void;
  removeFeedback: (id: string) => void;
  
  // [추가] 피드백 위치 업데이트
  updateFeedbackPosition: (id: string, x: number, y: number) => void;
  
  // 댓글 CRUD
  loadAnswers: (answers: Answer[]) => void;
  addAnswer: (answer: Answer) => void;
  updateAnswer: (id: string, comment: string) => void;
  removeAnswer: (id: string) => void;
  
  // 유틸리티
  getFeedbacksForImage: (imageId: string) => TaskFeedback[];
  getAnswersForFeedback: (feedbackId: string) => Answer[];
  canAddFeedback: (imageId: string) => boolean;
}

export const useTaskFeedbackStore = create<TaskFeedbackState>((set, get) => ({
  // 초기 상태
  feedbacksByImage: {},
  answersByFeedback: {},
  commentMode: 'view',
  activeFeedbackId: null,
  pendingPosition: null,
  currentImageId: null,
  
  // UI 액션
  setCommentMode: (mode) => set({ commentMode: mode }),
  
  setActiveFeedback: (id) => set({ activeFeedbackId: id }),
  
  setPendingPosition: (pos) => set({ pendingPosition: pos }),
  
  setCurrentImageId: (imageId) => set({ 
    currentImageId: imageId,
    activeFeedbackId: null,
    pendingPosition: null,
    commentMode: 'view'
  }),
  
  resetUIState: () => set({
    commentMode: 'view',
    activeFeedbackId: null,
    pendingPosition: null
  }),
  
  // 피드백 CRUD
  loadFeedbacks: (feedbacks) => {
    const grouped = feedbacks.reduce<FeedbacksByImage>((acc, feedback) => {
      const key = feedback.imageId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(feedback);
      return acc;
    }, {});
    set({ feedbacksByImage: grouped });
  },
  
  addFeedback: (feedback) => set((state) => {
    const imageId = feedback.imageId;
    const existing = state.feedbacksByImage[imageId] || [];
    return {
      feedbacksByImage: {
        ...state.feedbacksByImage,
        [imageId]: [...existing, feedback]
      },
      pendingPosition: null,
      commentMode: 'view'
    };
  }),
  
  updateFeedback: (id, updates) => set((state) => {
    const newFeedbacksByImage = { ...state.feedbacksByImage };
    for (const imageId in newFeedbacksByImage) {
      newFeedbacksByImage[imageId] = newFeedbacksByImage[imageId].map(f =>
        f.id === id ? { ...f, ...updates } : f
      );
    }
    return { feedbacksByImage: newFeedbacksByImage };
  }),
  
  removeFeedback: (id) => set((state) => {
    const newFeedbacksByImage = { ...state.feedbacksByImage };
    for (const imageId in newFeedbacksByImage) {
      newFeedbacksByImage[imageId] = newFeedbacksByImage[imageId].filter(f => f.id !== id);
    }
    const newAnswersByFeedback = { ...state.answersByFeedback };
    delete newAnswersByFeedback[id];
    
    return { 
      feedbacksByImage: newFeedbacksByImage,
      answersByFeedback: newAnswersByFeedback,
      activeFeedbackId: state.activeFeedbackId === id ? null : state.activeFeedbackId
    };
  }),

  updateFeedbackPosition: (id, x, y) => set((state) => {
    const newFeedbacksByImage = { ...state.feedbacksByImage };
    
    // 모든 이미지 그룹을 순회하며 해당 ID를 가진 피드백을 찾아 위치 업데이트
    for (const imageId in newFeedbacksByImage) {
      const index = newFeedbacksByImage[imageId].findIndex(f => f.id === id);
      if (index !== -1) {
        const feedback = newFeedbacksByImage[imageId][index];
        const updatedFeedback = { ...feedback, xPos: x, yPos: y };
        
        // 불변성 유지하며 배열 업데이트
        const newArray = [...newFeedbacksByImage[imageId]];
        newArray[index] = updatedFeedback;
        newFeedbacksByImage[imageId] = newArray;
        break; 
      }
    }
    return { feedbacksByImage: newFeedbacksByImage };
  }),
  
  // 댓글 CRUD
  loadAnswers: (answers) => {
    const grouped = answers.reduce<AnswersByFeedback>((acc, answer) => {
      const key = answer.feedbackId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(answer);
      return acc;
    }, {});
    set({ answersByFeedback: grouped });
  },
  
  addAnswer: (answer) => set((state) => {
    const feedbackId = answer.feedbackId;
    const existing = state.answersByFeedback[feedbackId] || [];
    return {
      answersByFeedback: {
        ...state.answersByFeedback,
        [feedbackId]: [...existing, answer]
      }
    };
  }),
  
  updateAnswer: (id, comment) => set((state) => {
    const newAnswersByFeedback = { ...state.answersByFeedback };
    for (const feedbackId in newAnswersByFeedback) {
      newAnswersByFeedback[feedbackId] = newAnswersByFeedback[feedbackId].map(a =>
        a.id === id ? { ...a, comment } : a
      );
    }
    return { answersByFeedback: newAnswersByFeedback };
  }),
  
  removeAnswer: (id) => set((state) => {
    const newAnswersByFeedback = { ...state.answersByFeedback };
    for (const feedbackId in newAnswersByFeedback) {
      newAnswersByFeedback[feedbackId] = newAnswersByFeedback[feedbackId].filter(a => a.id !== id);
    }
    return { answersByFeedback: newAnswersByFeedback };
  }),
  
  getFeedbacksForImage: (imageId) => get().feedbacksByImage[imageId] || [],
  
  getAnswersForFeedback: (feedbackId) => get().answersByFeedback[feedbackId] || [],
  
  canAddFeedback: (imageId) => {
    const feedbacks = get().feedbacksByImage[imageId] || [];
    return feedbacks.length < 3;
  }
}));