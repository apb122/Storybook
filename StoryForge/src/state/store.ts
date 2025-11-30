import { create } from 'zustand';
import type {
  StoryProject,
  Character,
  Location,
  StoryItem,
  PlotNode,
  StoryVariable,
  AiMessage,
  ContinuityIssue,
  Series,
  ManuscriptContent,
  ManuscriptComment,
  ManuscriptSnapshot,
  WritingTargets,
} from '@/types';
import { generateId } from '@/utils/ids';
import { loadStateFromStorage, debouncedSave, type PersistedState } from './persistence';

interface RootState extends PersistedState {
  // Actions
  // Projects
  addProject: (project: StoryProject) => void;
  updateProject: (id: string, updates: Partial<StoryProject>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  archiveProject: (id: string, archived: boolean) => void;

  // Characters
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;

  // Locations
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  deleteLocation: (id: string) => void;

  // Items
  addItem: (item: StoryItem) => void;
  updateItem: (id: string, updates: Partial<StoryItem>) => void;
  deleteItem: (id: string) => void;

  // PlotNodes
  addPlotNode: (node: PlotNode) => void;
  updatePlotNode: (id: string, updates: Partial<PlotNode>) => void;
  deletePlotNode: (id: string) => void;

  // Variables
  addVariable: (variable: StoryVariable) => void;
  updateVariable: (id: string, updates: Partial<StoryVariable>) => void;
  deleteVariable: (id: string) => void;

  // UI
  setSelectedProjectId: (id: string | undefined) => void;
  setSelectedEntityId: (id: string | undefined) => void;
  setSelectedPlotNodeId: (id: string | undefined) => void;

  // AI
  addAiMessage: (message: AiMessage) => void;
  clearAiMessages: (projectId: string) => void;

  // Writing Targets
  setWritingTargets: (targets: WritingTargets) => void;
  updateDailyProgress: (wordCount: number) => void;

  // Continuity
  addContinuityIssue: (issue: ContinuityIssue) => void;
  updateContinuityIssue: (id: string, updates: Partial<ContinuityIssue>) => void;
  deleteContinuityIssue: (id: string) => void;

  // Suggestions
  setSuggestedVariables: (variables: StoryVariable[]) => void;
  removeSuggestedVariable: (id: string) => void;

  // Series
  addSeries: (series: Series) => void;
  updateSeries: (id: string, updates: Partial<Series>) => void;
  deleteSeries: (id: string) => void;
  linkProjectToSeries: (seriesId: string, projectId: string) => void;
  unlinkProjectFromSeries: (seriesId: string, projectId: string) => void;
  addSharedCharacterToSeries: (seriesId: string, characterId: string) => void;
  removeSharedCharacterFromSeries: (seriesId: string, characterId: string) => void;
  addSharedLocationToSeries: (seriesId: string, locationId: string) => void;
  removeSharedLocationFromSeries: (seriesId: string, locationId: string) => void;

  // Manuscript
  updateSceneManuscript: (sceneId: string, content: ManuscriptContent, wordCount: number) => void;
  createManuscriptSnapshot: (sceneId: string, label: string) => void;
  restoreManuscriptSnapshot: (snapshotId: string) => void;
  deleteManuscriptSnapshot: (snapshotId: string) => void;
  addManuscriptComment: (comment: ManuscriptComment) => void;
  updateManuscriptComment: (id: string, updates: Partial<ManuscriptComment>) => void;
  deleteManuscriptComment: (id: string) => void;
  resolveManuscriptComment: (id: string) => void;
}

// Initial empty state
const initialState: PersistedState = {
  projects: [],
  characters: [],
  locations: [],
  items: [],
  plotNodes: [],
  variables: [],
  aiMessages: [],
  continuityIssues: [],
  suggestedVariables: [],
  series: [],
  manuscriptComments: [],
  manuscriptSnapshots: [],
  writingTargets: {
    daily: 0,
    total: 0,
    sessionStartWordCount: 0,
    lastSessionDate: new Date().toISOString().split('T')[0],
  },
  ui: {},
};

export const useStoryStore = create<RootState>((set) => {
  // Try to load from storage
  const loadedState = loadStateFromStorage();
  const startState = { ...initialState, ...loadedState };

  return {
    ...startState,

    // --- Projects ---
    addProject: (project: StoryProject) => {
      set((state: RootState) => {
        const newState = { ...state, projects: [...state.projects, project] };
        debouncedSave(newState);
        return newState;
      });
    },
    updateProject: (id: string, updates: Partial<StoryProject>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteProject: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          projects: state.projects.filter((p) => p.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    duplicateProject: (id: string) => {
      set((state: RootState) => {
        const project = state.projects.find((p) => p.id === id);
        if (!project) return state;

        const newId = crypto.randomUUID();
        const newProject: StoryProject = {
          ...project,
          id: newId,
          title: `${project.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        const newState = {
          ...state,
          projects: [...state.projects, newProject],
        };
        debouncedSave(newState);
        return newState;
      });
    },
    archiveProject: (id: string, archived: boolean) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, isArchived: archived, updatedAt: new Date().toISOString() } : p
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Characters ---
    addCharacter: (character: Character) => {
      set((state: RootState) => {
        const newState = { ...state, characters: [...state.characters, character] };
        debouncedSave(newState);
        return newState;
      });
    },
    updateCharacter: (id: string, updates: Partial<Character>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          characters: state.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteCharacter: (id: string) => {
      set((state: RootState) => {
        // Remove from characters list
        const newCharacters = state.characters.filter((c) => c.id !== id);

        // Remove from other characters' relationships
        const updatedCharacters = newCharacters.map((c) => ({
          ...c,
          relationships: c.relationships.filter((r) => r.characterId !== id),
        }));

        // Remove from PlotNodes (povCharacterId and involvedCharacterIds)
        const updatedPlotNodes = state.plotNodes.map((node) => ({
          ...node,
          povCharacterId: node.povCharacterId === id ? undefined : node.povCharacterId,
          involvedCharacterIds: node.involvedCharacterIds?.filter((cid) => cid !== id),
        }));

        // Remove from Series (sharedCharacterIds)
        const updatedSeries = state.series.map((s) => ({
          ...s,
          sharedCharacterIds: s.sharedCharacterIds?.filter((cid) => cid !== id),
        }));

        const newState = {
          ...state,
          characters: updatedCharacters,
          plotNodes: updatedPlotNodes,
          series: updatedSeries,
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Locations ---
    addLocation: (location: Location) => {
      set((state: RootState) => {
        const newState = { ...state, locations: [...state.locations, location] };
        debouncedSave(newState);
        return newState;
      });
    },
    updateLocation: (id: string, updates: Partial<Location>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          locations: state.locations.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteLocation: (id: string) => {
      set((state: RootState) => {
        // Remove from locations list
        const newLocations = state.locations.filter((l) => l.id !== id);

        // Remove from PlotNodes (locationId and involvedLocationIds)
        const updatedPlotNodes = state.plotNodes.map((node) => ({
          ...node,
          locationId: node.locationId === id ? undefined : node.locationId,
          involvedLocationIds: node.involvedLocationIds?.filter((lid) => lid !== id),
        }));

        // Remove from Series (sharedLocationIds)
        const updatedSeries = state.series.map((s) => ({
          ...s,
          sharedLocationIds: s.sharedLocationIds?.filter((lid) => lid !== id),
        }));

        const newState = {
          ...state,
          locations: newLocations,
          plotNodes: updatedPlotNodes,
          series: updatedSeries,
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Items ---
    addItem: (item: StoryItem) => {
      set((state: RootState) => {
        const newState = { ...state, items: [...state.items, item] };
        debouncedSave(newState);
        return newState;
      });
    },
    updateItem: (id: string, updates: Partial<StoryItem>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteItem: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          items: state.items.filter((i) => i.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Plot Nodes ---
    addPlotNode: (node: PlotNode) => {
      set((state: RootState) => {
        const newState = { ...state, plotNodes: [...state.plotNodes, node] };
        debouncedSave(newState);
        return newState;
      });
    },
    updatePlotNode: (id: string, updates: Partial<PlotNode>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          plotNodes: state.plotNodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deletePlotNode: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          plotNodes: state.plotNodes.filter((n) => n.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Variables ---
    addVariable: (variable: StoryVariable) => {
      set((state: RootState) => {
        const newState = { ...state, variables: [...state.variables, variable] };
        debouncedSave(newState);
        return newState;
      });
    },
    updateVariable: (id: string, updates: Partial<StoryVariable>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          variables: state.variables.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteVariable: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          variables: state.variables.filter((v) => v.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- UI ---
    setSelectedProjectId: (id: string | undefined) => {
      set((state: RootState) => {
        const newState = { ...state, ui: { ...state.ui, selectedProjectId: id } };
        debouncedSave(newState);
        return newState;
      });
    },
    setSelectedEntityId: (id: string | undefined) => {
      set((state: RootState) => {
        const newState = { ...state, ui: { ...state.ui, selectedEntityId: id } };
        debouncedSave(newState);
        return newState;
      });
    },
    setSelectedPlotNodeId: (id: string | undefined) => {
      set((state: RootState) => {
        const newState = { ...state, ui: { ...state.ui, selectedPlotNodeId: id } };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- AI ---
    addAiMessage: (message: AiMessage) => {
      set((state: RootState) => {
        const newState = { ...state, aiMessages: [...state.aiMessages, message] };
        debouncedSave(newState);
        return newState;
      });
    },
    clearAiMessages: (projectId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          aiMessages: state.aiMessages.filter((m) => m.projectId !== projectId),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Continuity ---
    addContinuityIssue: (issue: ContinuityIssue) => {
      set((state: RootState) => {
        const newState = { ...state, continuityIssues: [...state.continuityIssues, issue] };
        debouncedSave(newState);
        return newState;
      });
    },
    updateContinuityIssue: (id: string, updates: Partial<ContinuityIssue>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          continuityIssues: state.continuityIssues.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteContinuityIssue: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          continuityIssues: state.continuityIssues.filter((i) => i.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Suggestions ---
    setSuggestedVariables: (variables: StoryVariable[]) => {
      set((state: RootState) => {
        const newState = { ...state, suggestedVariables: variables };
        debouncedSave(newState);
        return newState;
      });
    },
    removeSuggestedVariable: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          suggestedVariables: state.suggestedVariables.filter((v) => v.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Series ---
    addSeries: (series: Series) => {
      set((state: RootState) => {
        const newState = { ...state, series: [...state.series, series] };
        debouncedSave(newState);
        return newState;
      });
    },
    updateSeries: (id: string, updates: Partial<Series>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteSeries: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.filter((s) => s.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    linkProjectToSeries: (seriesId: string, projectId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.map((s) =>
            s.id === seriesId
              ? {
                  ...s,
                  projectIds: [...(s.projectIds || []), projectId],
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    unlinkProjectFromSeries: (seriesId: string, projectId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.map((s) =>
            s.id === seriesId
              ? {
                  ...s,
                  projectIds: s.projectIds.filter((pid) => pid !== projectId),
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    addSharedCharacterToSeries: (seriesId: string, characterId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.map((s) =>
            s.id === seriesId
              ? {
                  ...s,
                  sharedCharacterIds: [...(s.sharedCharacterIds || []), characterId],
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    removeSharedCharacterFromSeries: (seriesId: string, characterId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.map((s) =>
            s.id === seriesId
              ? {
                  ...s,
                  sharedCharacterIds: (s.sharedCharacterIds || []).filter(
                    (cid) => cid !== characterId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    addSharedLocationToSeries: (seriesId: string, locationId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.map((s) =>
            s.id === seriesId
              ? {
                  ...s,
                  sharedLocationIds: [...(s.sharedLocationIds || []), locationId],
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    removeSharedLocationFromSeries: (seriesId: string, locationId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          series: state.series.map((s) =>
            s.id === seriesId
              ? {
                  ...s,
                  sharedLocationIds: (s.sharedLocationIds || []).filter(
                    (lid) => lid !== locationId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },

    // --- Manuscript ---
    updateSceneManuscript: (sceneId: string, content: ManuscriptContent, wordCount: number) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          plotNodes: state.plotNodes.map((node) =>
            node.id === sceneId
              ? {
                  ...node,
                  manuscriptContent: content,
                  wordCount,
                  updatedAt: new Date().toISOString(),
                }
              : node
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    createManuscriptSnapshot: (sceneId: string, label: string) => {
      set((state: RootState) => {
        const scene = state.plotNodes.find((n) => n.id === sceneId);
        if (!scene || !scene.manuscriptContent) return state;

        const snapshot: ManuscriptSnapshot = {
          id: generateId(),
          sceneId,
          projectId: scene.projectId,
          label,
          content: scene.manuscriptContent,
          wordCount: scene.wordCount || 0,
          createdAt: new Date().toISOString(),
        };

        const newState = {
          ...state,
          manuscriptSnapshots: [...state.manuscriptSnapshots, snapshot],
        };
        debouncedSave(newState);
        return newState;
      });
    },
    restoreManuscriptSnapshot: (snapshotId: string) => {
      set((state: RootState) => {
        const snapshot = state.manuscriptSnapshots.find((s) => s.id === snapshotId);
        if (!snapshot) return state;

        const newState = {
          ...state,
          plotNodes: state.plotNodes.map((node) =>
            node.id === snapshot.sceneId
              ? {
                  ...node,
                  manuscriptContent: snapshot.content,
                  wordCount: snapshot.wordCount,
                  updatedAt: new Date().toISOString(),
                }
              : node
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteManuscriptSnapshot: (snapshotId: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          manuscriptSnapshots: state.manuscriptSnapshots.filter((s) => s.id !== snapshotId),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    addManuscriptComment: (comment: ManuscriptComment) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          manuscriptComments: [...state.manuscriptComments, comment],
        };
        debouncedSave(newState);
        return newState;
      });
    },
    updateManuscriptComment: (id: string, updates: Partial<ManuscriptComment>) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          manuscriptComments: state.manuscriptComments.map((comment) =>
            comment.id === id
              ? { ...comment, ...updates, updatedAt: new Date().toISOString() }
              : comment
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    deleteManuscriptComment: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          manuscriptComments: state.manuscriptComments.filter((c) => c.id !== id),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    resolveManuscriptComment: (id: string) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          manuscriptComments: state.manuscriptComments.map((comment) =>
            comment.id === id
              ? { ...comment, resolved: true, updatedAt: new Date().toISOString() }
              : comment
          ),
        };
        debouncedSave(newState);
        return newState;
      });
    },
    setWritingTargets: (targets: WritingTargets) => {
      set((state: RootState) => {
        const newState = {
          ...state,
          writingTargets: targets,
        };
        debouncedSave(newState);
        return newState;
      });
    },
    updateDailyProgress: (wordCount: number) => {
      set((state: RootState) => {
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = state.writingTargets.lastSessionDate !== today;

        const newState = {
          ...state,
          writingTargets: {
            ...state.writingTargets,
            sessionStartWordCount: isNewDay
              ? 0
              : state.writingTargets.sessionStartWordCount + wordCount,
            lastSessionDate: today,
          },
        };
        debouncedSave(newState);
        return newState;
      });
    },
  };
});
