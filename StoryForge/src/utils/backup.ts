import { useStoryStore } from '@/state/store';
import type {
  StoryProject,
  Character,
  Location,
  StoryItem,
  PlotNode,
  StoryVariable,
  AiMessage,
  ContinuityIssue,
} from '@/types';

interface BackupData {
  version: number;
  timestamp: string;
  data: {
    projects: StoryProject[];
    characters: Character[];
    locations: Location[];
    items: StoryItem[];
    plotNodes: PlotNode[];
    variables: StoryVariable[];
    aiMessages: AiMessage[];
    continuityIssues: ContinuityIssue[];
  };
}

export const exportStoreData = () => {
  const state = useStoryStore.getState();

  const backup: BackupData = {
    version: 1,
    timestamp: new Date().toISOString(),
    data: {
      projects: state.projects,
      characters: state.characters,
      locations: state.locations,
      items: state.items,
      plotNodes: state.plotNodes,
      variables: state.variables,
      aiMessages: state.aiMessages,
      continuityIssues: state.continuityIssues,
    },
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `storyforge-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importStoreData = async (
  file: File,
  mode: 'merge' | 'replace'
): Promise<{ success: boolean; message: string }> => {
  try {
    const text = await file.text();
    const backup: BackupData = JSON.parse(text);

    // Basic validation
    if (!backup.data || !Array.isArray(backup.data.projects)) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    if (mode === 'replace') {
      // Overwriting local storage is the most robust "Replace" for a persisted store.
      const newState = {
        state: {
          ...backup.data,
          suggestedVariables: [], // Don't import suggestions
          ui: {}, // Reset UI state
        },
        version: 0, // Zustand persist version
      };

      localStorage.setItem('storyforge-storage', JSON.stringify(newState));
      window.location.reload();
      return { success: true, message: 'Data restored successfully. Reloading...' };
    }

    if (mode === 'merge') {
      // For merge, we'll just append data.
      // Ideally we would check for ID collisions, but for now we'll assume UUIDs are unique enough
      // or that the user knows what they are doing.
      // A safer merge would be to regenerate IDs, but that breaks relationships.
      // So we will filter out items that already exist by ID.

      const merge = <T extends { id: string }>(current: T[], incoming: T[]) => {
        const currentIds = new Set(current.map((i) => i.id));
        return [...current, ...incoming.filter((i) => !currentIds.has(i.id))];
      };

      useStoryStore.setState((state) => ({
        projects: merge(state.projects, backup.data.projects),
        characters: merge(state.characters, backup.data.characters),
        locations: merge(state.locations, backup.data.locations),
        items: merge(state.items, backup.data.items),
        plotNodes: merge(state.plotNodes, backup.data.plotNodes),
        variables: merge(state.variables, backup.data.variables),
        aiMessages: merge(state.aiMessages, backup.data.aiMessages),
        continuityIssues: merge(state.continuityIssues, backup.data.continuityIssues),
      }));

      return { success: true, message: 'Data merged successfully.' };
    }

    return { success: false, message: 'Invalid import mode.' };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, message: 'Failed to parse backup file.' };
  }
};
