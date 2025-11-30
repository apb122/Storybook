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

const STORAGE_KEY = 'storyforge_state';

/**
 * Defines the shape of the persisted state.
 * This should match the RootState in the store, but we define it here to avoid circular dependencies
 * if we were to import RootState (though we could just use Partial<any> to be lazy).
 * We'll be explicit for clarity.
 */
export interface PersistedState {
  projects: StoryProject[];
  characters: Character[];
  locations: Location[];
  items: StoryItem[];
  plotNodes: PlotNode[];
  variables: StoryVariable[];
  aiMessages: AiMessage[];
  continuityIssues: ContinuityIssue[];
  suggestedVariables: StoryVariable[];
  ui: {
    selectedProjectId?: string;
    selectedEntityId?: string;
    selectedPlotNodeId?: string;
  };
}

/**
 * Loads the state from localStorage.
 * Returns undefined if no state is found or if parsing fails.
 */
export const loadStateFromStorage = (): Partial<PersistedState> | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined;
  }
};

/**
 * Saves the state to localStorage.
 */
export const saveStateToStorage = (state: PersistedState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

/**
 * Debounce function to limit how often we write to storage.
 */
export const debounce = <Args extends unknown[]>(func: (...args: Args) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Create a debounced version of the save function
export const debouncedSave = debounce(saveStateToStorage, 1000);
