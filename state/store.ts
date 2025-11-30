/**
 * StoryForge Zustand Store
 *
 * Central state management for the entire application.
 * Manages all story data, characters, locations, plot nodes, and UI state.
 * Automatically persists to localStorage with debounced saves.
 */

import { create } from "zustand";
import type {
  StoryProject,
  Character,
  Location,
  StoryItem,
  PlotNode,
  StoryVariable,
  AiMessage,
  ContinuityIssue,
} from "@/types";
import {
  RootState,
  loadStateFromStorage,
  saveStateToStorage,
} from "./persistence";

/**
 * Action creators for story projects
 */
interface ProjectActions {
  addProject: (project: StoryProject) => void;
  updateProject: (id: string, updates: Partial<StoryProject>) => void;
  deleteProject: (id: string) => void;
}

/**
 * Action creators for characters
 */
interface CharacterActions {
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
}

/**
 * Action creators for locations
 */
interface LocationActions {
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
}

/**
 * Action creators for story items
 */
interface ItemActions {
  addItem: (item: StoryItem) => void;
  updateItem: (id: string, updates: Partial<StoryItem>) => void;
  deleteItem: (id: string) => void;
}

/**
 * Action creators for plot nodes
 */
interface PlotNodeActions {
  addPlotNode: (node: PlotNode) => void;
  updatePlotNode: (id: string, updates: Partial<PlotNode>) => void;
  deletePlotNode: (id: string) => void;
}

/**
 * Action creators for story variables
 */
interface VariableActions {
  addVariable: (variable: StoryVariable) => void;
  updateVariable: (id: string, updates: Partial<StoryVariable>) => void;
  deleteVariable: (id: string) => void;
}

/**
 * Action creators for AI messages
 */
interface MessageActions {
  addMessage: (message: AiMessage) => void;
  deleteMessage: (id: string) => void;
  clearMessages: (projectId: string) => void;
}

/**
 * Action creators for continuity issues
 */
interface IssueActions {
  addIssue: (issue: ContinuityIssue) => void;
  updateIssue: (id: string, updates: Partial<ContinuityIssue>) => void;
  deleteIssue: (id: string) => void;
  resolveIssue: (id: string) => void;
}

/**
 * Action creators for UI state
 */
interface UIActions {
  setSelectedProjectId: (id?: string) => void;
  setSelectedEntityId: (id?: string) => void;
  setSelectedPlotNodeId: (id?: string) => void;
}

/**
 * Complete store interface combining state and actions
 */
type StoryStore = RootState &
  ProjectActions &
  CharacterActions &
  LocationActions &
  ItemActions &
  PlotNodeActions &
  VariableActions &
  MessageActions &
  IssueActions &
  UIActions;

/**
 * Create the global Zustand store
 *
 * Store structure:
 * - Data entities: projects, characters, locations, items, plotNodes, variables, aiMessages, continuityIssues
 * - UI state: selectedProjectId, selectedEntityId, selectedPlotNodeId
 * - Actions: CRUD operations for each entity type + UI setters
 *
 * Initialization:
 * - Hydrates from localStorage if available
 * - Subscribes to changes and auto-saves with debouncing
 */
export const useStoryStore = create<StoryStore>((set) => {
  // Load persisted state
  const persistedState = loadStateFromStorage();

  return {
    // Initial state (hydrate from localStorage if available)
    projects: persistedState?.projects ?? [],
    characters: persistedState?.characters ?? [],
    locations: persistedState?.locations ?? [],
    items: persistedState?.items ?? [],
    plotNodes: persistedState?.plotNodes ?? [],
    variables: persistedState?.variables ?? [],
    aiMessages: persistedState?.aiMessages ?? [],
    continuityIssues: persistedState?.continuityIssues ?? [],
    ui: persistedState?.ui ?? {
      selectedProjectId: undefined,
      selectedEntityId: undefined,
      selectedPlotNodeId: undefined,
    },

    // ============ Project Actions ============
    addProject: (project) =>
      set((state) => ({
        projects: [...state.projects, project],
      })),

    updateProject: (id, updates) =>
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p,
        ),
      })),

    deleteProject: (id) =>
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        // Clear selection if deleted project was selected
        ui:
          state.ui.selectedProjectId === id
            ? { ...state.ui, selectedProjectId: undefined }
            : state.ui,
      })),

    // ============ Character Actions ============
    addCharacter: (character) =>
      set((state) => ({
        characters: [...state.characters, character],
      })),

    updateCharacter: (id, updates) =>
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      })),

    deleteCharacter: (id) =>
      set((state) => ({
        characters: state.characters.filter((c) => c.id !== id),
        ui:
          state.ui.selectedEntityId === id
            ? { ...state.ui, selectedEntityId: undefined }
            : state.ui,
      })),

    // ============ Location Actions ============
    addLocation: (location) =>
      set((state) => ({
        locations: [...state.locations, location],
      })),

    updateLocation: (id, updates) =>
      set((state) => ({
        locations: state.locations.map((l) =>
          l.id === id ? { ...l, ...updates } : l,
        ),
      })),

    deleteLocation: (id) =>
      set((state) => ({
        locations: state.locations.filter((l) => l.id !== id),
        ui:
          state.ui.selectedEntityId === id
            ? { ...state.ui, selectedEntityId: undefined }
            : state.ui,
      })),

    // ============ Item Actions ============
    addItem: (item) =>
      set((state) => ({
        items: [...state.items, item],
      })),

    updateItem: (id, updates) =>
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      })),

    deleteItem: (id) =>
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        ui:
          state.ui.selectedEntityId === id
            ? { ...state.ui, selectedEntityId: undefined }
            : state.ui,
      })),

    // ============ Plot Node Actions ============
    addPlotNode: (node) =>
      set((state) => ({
        plotNodes: [...state.plotNodes, node],
      })),

    updatePlotNode: (id, updates) =>
      set((state) => ({
        plotNodes: state.plotNodes.map((n) =>
          n.id === id ? { ...n, ...updates } : n,
        ),
      })),

    deletePlotNode: (id) =>
      set((state) => ({
        plotNodes: state.plotNodes.filter((n) => n.id !== id),
        ui:
          state.ui.selectedPlotNodeId === id
            ? { ...state.ui, selectedPlotNodeId: undefined }
            : state.ui,
      })),

    // ============ Variable Actions ============
    addVariable: (variable) =>
      set((state) => ({
        variables: [...state.variables, variable],
      })),

    updateVariable: (id, updates) =>
      set((state) => ({
        variables: state.variables.map((v) =>
          v.id === id
            ? { ...v, ...updates, lastUpdated: new Date().toISOString() }
            : v,
        ),
      })),

    deleteVariable: (id) =>
      set((state) => ({
        variables: state.variables.filter((v) => v.id !== id),
      })),

    // ============ Message Actions ============
    addMessage: (message) =>
      set((state) => ({
        aiMessages: [...state.aiMessages, message],
      })),

    deleteMessage: (id) =>
      set((state) => ({
        aiMessages: state.aiMessages.filter((m) => m.id !== id),
      })),

    clearMessages: (projectId) =>
      set((state) => ({
        aiMessages: state.aiMessages.filter((m) => m.projectId !== projectId),
      })),

    // ============ Issue Actions ============
    addIssue: (issue) =>
      set((state) => ({
        continuityIssues: [...state.continuityIssues, issue],
      })),

    updateIssue: (id, updates) =>
      set((state) => ({
        continuityIssues: state.continuityIssues.map((i) =>
          i.id === id ? { ...i, ...updates } : i,
        ),
      })),

    deleteIssue: (id) =>
      set((state) => ({
        continuityIssues: state.continuityIssues.filter((i) => i.id !== id),
      })),

    resolveIssue: (id) =>
      set((state) => ({
        continuityIssues: state.continuityIssues.map((i) =>
          i.id === id
            ? { ...i, resolved: true, resolvedAt: new Date().toISOString() }
            : i,
        ),
      })),

    // ============ UI Actions ============
    setSelectedProjectId: (id) =>
      set((state) => ({
        ui: { ...state.ui, selectedProjectId: id },
      })),

    setSelectedEntityId: (id) =>
      set((state) => ({
        ui: { ...state.ui, selectedEntityId: id },
      })),

    setSelectedPlotNodeId: (id) =>
      set((state) => ({
        ui: { ...state.ui, selectedPlotNodeId: id },
      })),
  };
});

// Subscribe to store changes and persist to localStorage
useStoryStore.subscribe((state) => {
  // Filter out action functions before saving
  const dataState: Partial<RootState> = {
    projects: state.projects,
    characters: state.characters,
    locations: state.locations,
    items: state.items,
    plotNodes: state.plotNodes,
    variables: state.variables,
    aiMessages: state.aiMessages,
    continuityIssues: state.continuityIssues,
    ui: state.ui,
  };
  saveStateToStorage(dataState as RootState);
});

/**
 * Selector hooks for common state queries
 * These provide optimized access patterns to prevent unnecessary re-renders
 */

/** Get all projects for the current workspace */
export const useProjects = () => useStoryStore((state) => state.projects);

/** Get all characters for the current workspace */
export const useCharacters = () => useStoryStore((state) => state.characters);

/** Get all locations for the current workspace */
export const useLocations = () => useStoryStore((state) => state.locations);

/** Get all story items */
export const useItems = () => useStoryStore((state) => state.items);

/** Get all plot nodes */
export const usePlotNodes = () => useStoryStore((state) => state.plotNodes);

/** Get UI state (selections) */
export const useUIState = () => useStoryStore((state) => state.ui);

/** Get the currently selected project */
export const useSelectedProject = () =>
  useStoryStore((state) => {
    const selectedId = state.ui.selectedProjectId;
    return selectedId
      ? state.projects.find((p) => p.id === selectedId)
      : undefined;
  });

/** Get project count for dashboard display */
export const useProjectCount = () =>
  useStoryStore((state) => state.projects.length);

/** Get character count for a specific project */
export const useCharacterCountForProject = (projectId: string) =>
  useStoryStore(
    (state) => state.characters.filter((c) => c.projectId === projectId).length,
  );
