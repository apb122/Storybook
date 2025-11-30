import type {
  StoryProject,
  Character,
  PlotNode,
  StoryVariable,
  StoryContextSnapshot,
} from '@/types';

export const buildStoryContextSnapshot = (
  projectId: string,
  projects: StoryProject[],
  characters: Character[],
  plotNodes: PlotNode[],
  variables: StoryVariable[],
  currentPlotNodeId?: string
): StoryContextSnapshot => {
  const projectSummary = projects.find((p) => p.id === projectId)?.logline || 'N/A';

  const projectCharacters = characters.filter((c) => c.projectId === projectId);
  const keyCharacters = projectCharacters
    .sort((a, b) => {
      // Prioritize protagonists and antagonists
      const roleScore = (role: string) => {
        if (role === 'protagonist') return 3;
        if (role === 'antagonist') return 2;
        if (role === 'supporting') return 1;
        return 0;
      };
      return roleScore(b.role) - roleScore(a.role);
    })
    .slice(0, 10) // Limit to top 10 characters
    .map((c) => `${c.name} (${c.role}): ${c.traits?.join(', ') || ''}`);

  // Get current plot node summary if available
  let currentPlotNodeSummary = undefined;
  if (currentPlotNodeId) {
    const node = plotNodes.find((n) => n.id === currentPlotNodeId);
    if (node) {
      currentPlotNodeSummary = `Current Scene/Chapter: ${node.title}\nSummary: ${node.summary || 'N/A'}\nGoals: ${node.goals || 'N/A'}\nConflict: ${node.conflict || 'N/A'}`;
    }
  }

  // Get named variables
  const projectVariables = variables.filter((v) => v.projectId === projectId);
  const namedVariables: Record<string, string> = {};
  projectVariables.forEach((v) => {
    namedVariables[v.key] = v.value;
  });

  return {
    projectSummary,
    keyCharacters,
    currentPlotNodeSummary,
    namedVariables,
  };
};
