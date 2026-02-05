import { useRef, useState } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useTaskFeedbackStore } from '@/shared/stores/taskFeedbackStore';
import { calculatePercentPosition, getFeedbackPositionStyles } from '../model/feedbackUtils';
import { FeedbackPin } from './FeedbackPin';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackInputForm } from './FeedbackInputForm';
import { UserRole } from '@/shared/constants/enums';

interface FeedbackOverlayProps {
  taskId: string;
  imageId: string;
  currentUserId: string;
  userRole: UserRole;
}

export const FeedbackOverlay = ({ taskId, imageId, currentUserId, userRole }: FeedbackOverlayProps) => {
  const toast = useToast();
  const store = useTaskFeedbackStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  
  const feedbacks = store.getFeedbacksForImage(imageId);
  const isCreating = !!store.pendingPosition;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (store.commentMode === 'create') {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = calculatePercentPosition(e.clientX, e.clientY, rect);
      store.setPendingPosition(pos);
    } else {
      store.setActiveFeedback(null);
      store.setPendingPosition(null);
      store.setCommentMode('view');
    }
  };

  const handleCreateFeedback = (content: string, imageUrl: string | null) => {
    if (!store.pendingPosition) return;
    
    const newFeedback = {
      id: Date.now().toString(),
      content,
      imageUrl,
      createdAt: new Date().toISOString(),
      xPos: store.pendingPosition.x,
      yPos: store.pendingPosition.y,
      taskId,
      mentorId: currentUserId,
      imageId,
    };

    store.addFeedback(newFeedback);
    store.setPendingPosition(null);
    toast({ status: 'success', title: '피드백이 등록되었습니다.' });
  };

  const handlePositionChange = (id: string, newX: number, newY: number) => {
    store.updateFeedbackPosition(id, newX, newY);
  };

  return (
    <Box
      ref={containerRef}
      position="absolute"
      top={0}
      left={0}
      w="full"
      h="full"
      onClick={handleOverlayClick}
      cursor={store.commentMode === 'create' ? 'crosshair' : 'default'}
      zIndex={10}
    >
      <AnimatePresence>
        {feedbacks.map(fb => {
          const isActive = store.activeFeedbackId === fb.id;
          
          const isDimmed = (!!hoveredPinId && hoveredPinId !== fb.id) || isCreating;

          return isActive ? (
            <FeedbackCard
               key={fb.id}
               feedback={{ ...fb, authorName: '김멘토', authorProfileUrl: null }}
               answers={store.getAnswersForFeedback(fb.id).map(a => ({...a, authorName: 'User', authorRole: "MENTEE", authorProfileUrl: null}))}
               currentUserId={currentUserId}
               userRole={userRole}
               onClose={() => store.setActiveFeedback(null)}
               onUpdateFeedback={(c, i) => store.updateFeedback(fb.id, { content: c, imageUrl: i })}
               onDeleteFeedback={() => { store.removeFeedback(fb.id); }}
               onAddAnswer={(c) => store.addAnswer({ id: Date.now().toString(), comment: c, userId: currentUserId, feedbackId: fb.id, createdAt: new Date().toISOString() })}
               onUpdateAnswer={(id, c) => store.updateAnswer(id, c)}
               onDeleteAnswer={(id) => store.removeAnswer(id)}
            />
          ) : (
            <FeedbackPin
              key={fb.id}
              feedback={fb}
              containerRef={containerRef}
              isDraggable={userRole === "MENTOR" && fb.mentorId === currentUserId && !isCreating}
              
              isDimmed={isDimmed}
              onMouseEnter={() => !isCreating && setHoveredPinId(fb.id)}
              onMouseLeave={() => setHoveredPinId(null)}

              onPositionChange={handlePositionChange}
              onClick={() => {
                 if (isCreating) return;
                 store.setActiveFeedback(fb.id);
                 store.setCommentMode('view');
                 store.setPendingPosition(null);
              }}
            />
          );
        })}
      </AnimatePresence>
      
      <AnimatePresence>
        {store.pendingPosition && (
          <Box 
            position="absolute" 
            zIndex={200}
            onClick={(e) => e.stopPropagation()}
            style={{ ...getFeedbackPositionStyles(store.pendingPosition.x, store.pendingPosition.y).positionStyles }}
          >
            <FeedbackInputForm
              onSave={handleCreateFeedback}
              onCancel={() => { store.setPendingPosition(null); store.setCommentMode('view'); }}
            />
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};