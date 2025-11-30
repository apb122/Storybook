import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStoryStore } from './store';
import type { Character, PlotNode, StoryProject } from '@/types';

// Mock persistence to avoid localStorage interactions and side effects
vi.mock('./persistence', () => ({
    loadStateFromStorage: () => ({}),
    debouncedSave: vi.fn(),
}));

describe('useStoryStore', () => {
    // Reset store before each test
    beforeEach(() => {
        useStoryStore.setState({
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
        });
    });

    it('should cascade delete characters from plot nodes', () => {
        const store = useStoryStore.getState();

        // 1. Setup Data
        const projectId = 'proj-1';
        const charId = 'char-1';
        const sceneId = 'scene-1';

        const project: StoryProject = {
            id: projectId,
            title: 'Test Project',
            status: 'planning',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
        };

        const character: Character = {
            id: charId,
            projectId,
            name: 'John Doe',
            role: 'protagonist',
            relationships: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const scene: PlotNode = {
            id: sceneId,
            projectId,
            title: 'Scene 1',
            type: 'scene',
            order: 1,
            involvedCharacterIds: [charId],
            povCharacterId: charId,
            parentId: null,
        };

        // 2. Add to Store
        store.addProject(project);
        store.addCharacter(character);
        store.addPlotNode(scene);

        // Verify initial state
        let state = useStoryStore.getState();
        expect(state.characters).toHaveLength(1);
        expect(state.plotNodes[0].involvedCharacterIds).toContain(charId);
        expect(state.plotNodes[0].povCharacterId).toBe(charId);

        // 3. Delete Character
        store.deleteCharacter(charId);

        // 4. Verify Cascade Delete
        state = useStoryStore.getState();

        // Character should be gone
        expect(state.characters).toHaveLength(0);

        // Scene references should be cleaned up
        const updatedScene = state.plotNodes[0];
        expect(updatedScene.involvedCharacterIds).not.toContain(charId);
        expect(updatedScene.involvedCharacterIds).toHaveLength(0);
        expect(updatedScene.povCharacterId).toBeUndefined();
    });

    it('should cascade delete locations from plot nodes', () => {
        const store = useStoryStore.getState();
        const locId = 'loc-1';
        const sceneId = 'scene-1';

        store.addLocation({
            id: locId,
            projectId: 'p1',
            name: 'Castle',
            type: 'setting',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        store.addPlotNode({
            id: sceneId,
            projectId: 'p1',
            title: 'Scene',
            type: 'scene',
            order: 1,
            locationId: locId,
            involvedLocationIds: [locId],
            parentId: null,
        });

        // Delete Location
        store.deleteLocation(locId);

        const state = useStoryStore.getState();
        const scene = state.plotNodes[0];

        expect(state.locations).toHaveLength(0);
        expect(scene.locationId).toBeUndefined();
        expect(scene.involvedLocationIds).not.toContain(locId);
    });
});
