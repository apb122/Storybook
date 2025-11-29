/**
 * localStorage Persistence Layer for StoryForge
 *
 * Handles saving and loading application state from browser storage.
 * Includes error handling and debouncing to prevent excessive writes.
 */

import type {
  StoryProject,
  Character,
  Location,
  StoryItem,
  PlotNode,
  StoryVariable,
  AiMessage,
  ContinuityIssue,
} from '@/types'

/** Storage key for persisting the entire application state */
const STORAGE_KEY = 'storyforge_state'

/** Debounce delay in milliseconds to batch rapid saves */
const DEBOUNCE_DELAY = 1000

/**
 * Root state interface matching the Zustand store structure
 */
export interface RootState {
  projects: StoryProject[]
  characters: Character[]
  locations: Location[]
  items: StoryItem[]
  plotNodes: PlotNode[]
  variables: StoryVariable[]
  aiMessages: AiMessage[]
  continuityIssues: ContinuityIssue[]
  ui: {
    selectedProjectId?: string
    selectedEntityId?: string
    selectedPlotNodeId?: string
  }
}

/**
 * Debounce timer reference for batch saves
 */
let debounceTimer: ReturnType<typeof setTimeout> | undefined

/**
 * Loads the application state from localStorage
 *
 * Safely parses and returns stored state, handling missing data
 * or corrupted JSON gracefully. Returns undefined if no state
 * is found or if an error occurs.
 *
 * @returns Partial state from storage, or undefined if not found/invalid
 */
export function loadStateFromStorage(): Partial<RootState> | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      console.log('[Storage] No existing state found in localStorage')
      return undefined
    }

    const parsed = JSON.parse(stored) as Partial<RootState>
    console.log('[Storage] State loaded successfully from localStorage')
    return parsed
  } catch (error) {
    console.error(
      '[Storage] Failed to load state from localStorage:',
      error instanceof Error ? error.message : error,
    )
    return undefined
  }
}

/**
 * Saves the application state to localStorage with debouncing
 *
 * Uses debouncing to batch rapid saves (e.g., during continuous editing)
 * into a single write operation, reducing localStorage pressure.
 * Silently fails if storage is unavailable (e.g., in private browsing).
 *
 * @param state - Complete application state to persist
 * @param immediate - If true, saves immediately without debouncing
 */
export function saveStateToStorage(
  state: RootState,
  immediate = false,
): void {
  // Clear any pending save
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  const performSave = () => {
    try {
      const serialized = JSON.stringify(state)
      localStorage.setItem(STORAGE_KEY, serialized)
      console.log('[Storage] State saved to localStorage')
    } catch (error) {
      // Silently fail - storage might be unavailable in private browsing
      console.warn(
        '[Storage] Failed to save state:',
        error instanceof Error ? error.message : error,
      )
    }
  }

  if (immediate) {
    performSave()
  } else {
    // Schedule save with debounce delay
    debounceTimer = setTimeout(performSave, DEBOUNCE_DELAY)
  }
}

/**
 * Clears all persisted state from localStorage
 *
 * Useful for debugging, testing, or allowing users to reset their workspace.
 */
export function clearStoredState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('[Storage] Persisted state cleared from localStorage')
  } catch (error) {
    console.warn(
      '[Storage] Failed to clear state:',
      error instanceof Error ? error.message : error,
    )
  }
}
