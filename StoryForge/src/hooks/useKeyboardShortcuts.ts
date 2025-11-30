import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/state/store';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const selectedProjectId = useStoryStore((state) => state.ui.selectedProjectId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Global Navigation Shortcuts (require a selected project)
      if (selectedProjectId) {
        // Ctrl+Shift+B: Story Bible
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'b') {
          e.preventDefault();
          navigate(`/app/project/${selectedProjectId}/story-bible`);
        }

        // Ctrl+Shift+P: Plot
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          navigate(`/app/project/${selectedProjectId}/plot`);
        }

        // Ctrl+Shift+T: Timeline
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
          e.preventDefault();
          navigate(`/app/project/${selectedProjectId}/timeline`);
        }

        // Ctrl+Shift+A: AI Workshop
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          navigate(`/app/project/${selectedProjectId}/ai-workshop`);
        }
      }

      // Global Actions
      // Ctrl+K: Command Palette (Placeholder)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        console.log('Open Command Palette');
        // TODO: Implement Command Palette toggle
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, selectedProjectId]);
};
