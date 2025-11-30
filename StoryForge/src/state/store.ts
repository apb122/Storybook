import { create } from 'zustand';
import type {
    StoryProject, Character, Location, StoryItem, PlotNode, StoryVariable
} from '../types';
import { loadStateFromStorage, debouncedSave, type PersistedState } from './persistence';

interface RootState extends PersistedState {
    // Actions
    // Projects
    addProject: (project: StoryProject) => void;
    updateProject: (id: string, updates: Partial<StoryProject>) => void;
    deleteProject: (id: string) => void;

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
    ui: {},
};

export const useStoryStore = create<RootState>((set) => {
    // Try to load from storage
    const loadedState = loadStateFromStorage();
    const startState = { ...initialState, ...loadedState };

    return {
        ...startState,

        // --- Projects ---
        addProject: (project) => {
            set((state) => {
                const newState = { ...state, projects: [...state.projects, project] };
                debouncedSave(newState);
                return newState;
            });
        },
        updateProject: (id, updates) => {
            set((state) => {
                const newState = {
                    ...state,
                    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
                };
                debouncedSave(newState);
                return newState;
            });
        },
        deleteProject: (id) => {
            set((state) => {
                const newState = {
                    ...state,
                    projects: state.projects.filter((p) => p.id !== id),
                };
                debouncedSave(newState);
                return newState;
            });
        },

        // --- Characters ---
        addCharacter: (character) => {
            set((state) => {
                const newState = { ...state, characters: [...state.characters, character] };
                debouncedSave(newState);
                return newState;
            });
        },
        updateCharacter: (id, updates) => {
            set((state) => {
                const newState = {
                    ...state,
                    characters: state.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                };
                debouncedSave(newState);
                return newState;
            });
        },
        deleteCharacter: (id) => {
            set((state) => {
                const newState = {
                    ...state,
                    characters: state.characters.filter((c) => c.id !== id),
                };
                debouncedSave(newState);
                return newState;
            });
        },

        // --- Locations ---
        addLocation: (location) => {
            set((state) => {
                const newState = { ...state, locations: [...state.locations, location] };
                debouncedSave(newState);
                return newState;
            });
        },
        updateLocation: (id, updates) => {
            set((state) => {
                const newState = {
                    ...state,
                    locations: state.locations.map((l) => (l.id === id ? { ...l, ...updates } : l)),
                };
                debouncedSave(newState);
                return newState;
            });
        },
        deleteLocation: (id) => {
            set((state) => {
                const newState = {
                    ...state,
                    locations: state.locations.filter((l) => l.id !== id),
                };
                debouncedSave(newState);
                return newState;
            });
        },

        // --- Items ---
        addItem: (item) => {
            set((state) => {
                const newState = { ...state, items: [...state.items, item] };
                debouncedSave(newState);
                return newState;
            });
        },
        updateItem: (id, updates) => {
            set((state) => {
                const newState = {
                    ...state,
                    items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
                };
                debouncedSave(newState);
                return newState;
            });
        },
        deleteItem: (id) => {
            set((state) => {
                const newState = {
                    ...state,
                    items: state.items.filter((i) => i.id !== id),
                };
                debouncedSave(newState);
                return newState;
            });
        },

        // --- PlotNodes ---
        addPlotNode: (node) => {
            set((state) => {
                const newState = { ...state, plotNodes: [...state.plotNodes, node] };
                debouncedSave(newState);
                return newState;
            });
        },
        updatePlotNode: (id, updates) => {
            set((state) => {
                const newState = {
                    ...state,
                    plotNodes: state.plotNodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
                };
                debouncedSave(newState);
                return newState;
            });
        },
        deletePlotNode: (id) => {
            set((state) => {
                const newState = {
                    ...state,
                    plotNodes: state.plotNodes.filter((n) => n.id !== id),
                };
                debouncedSave(newState);
                return newState;
            });
        },

        // --- Variables ---
        addVariable: (variable) => {
            set((state) => {
                const newState = { ...state, variables: [...state.variables, variable] };
                debouncedSave(newState);
                return newState;
            });
        },
        updateVariable: (id, updates) => {
            set((state) => {
                const newState = {
                    ...state,
                    variables: state.variables.map((v) => (v.id === id ? { ...v, ...updates } : v)),
                };
                debouncedSave(newState);
                return newState;
            });
        },
        deleteVariable: (id) => {
            set((state) => {
                const newState = {
                    ...state,
                    variables: state.variables.filter((v) => v.id !== id),
                };
                debouncedSave(newState);
                return newState;
            });
        },

        // --- UI ---
        setSelectedProjectId: (id) => {
            set((state) => {
                const newState = { ...state, ui: { ...state.ui, selectedProjectId: id } };
                debouncedSave(newState);
                return newState;
            });
        },
        setSelectedEntityId: (id) => {
            set((state) => {
                const newState = { ...state, ui: { ...state.ui, selectedEntityId: id } };
                debouncedSave(newState);
                return newState;
            });
        },
        setSelectedPlotNodeId: (id) => {
            set((state) => {
                const newState = { ...state, ui: { ...state.ui, selectedPlotNodeId: id } };
                debouncedSave(newState);
                return newState;
            });
        },
    };
});
