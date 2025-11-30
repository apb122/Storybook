import { useParams } from 'react-router-dom';
import { StoryBibleView } from '@/features/storyBible/StoryBibleView';
import { PlotOutlineView } from '@/features/storyBible/components/PlotOutlineView';
import { TimelineView } from '@/features/timeline/TimelineView';
import { AiWorkshopView } from '@/features/ai/AiWorkshopView';

export function StoryBibleWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <StoryBibleView projectId={projectId} />;
}

export function PlotWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <PlotOutlineView projectId={projectId} />;
}

export function TimelineWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <TimelineView projectId={projectId} />;
}

export function AiWorkshopWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <AiWorkshopView projectId={projectId} />;
}
