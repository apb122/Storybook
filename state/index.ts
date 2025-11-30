/**
 * State Management Module
 *
 * Central export point for all state management utilities.
 * Re-exports the main store and selector hooks.
 *
 * @example
 * import { useStoryStore, useProjects } from '@/state'
 */

export {
  useStoryStore,
  useProjects,
  useCharacters,
  useLocations,
  useItems,
  usePlotNodes,
  useUIState,
  useSelectedProject,
  useProjectCount,
  useCharacterCountForProject,
} from "./store";

export {
  loadStateFromStorage,
  saveStateToStorage,
  clearStoredState,
} from "./persistence";

export type { RootState } from "./persistence";
