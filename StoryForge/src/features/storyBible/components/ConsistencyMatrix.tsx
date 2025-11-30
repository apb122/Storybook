import React, { useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { AlertCircle } from 'lucide-react';

interface ConsistencyMatrixProps {
  projectId: string;
}

export const ConsistencyMatrix: React.FC<ConsistencyMatrixProps> = ({ projectId }) => {
  const characters = useStoryStore(
    useShallow((state) => state.characters.filter((c) => c.projectId === projectId))
  );
  const scenes = useStoryStore(
    useShallow((state) =>
      state.plotNodes
        .filter((n) => n.projectId === projectId && n.type === 'scene')
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    )
  );
  const issues = useStoryStore(
    useShallow((state) => state.continuityIssues.filter((i) => i.projectId === projectId))
  );

  // Calculate matrix data
  const matrix = useMemo(() => {
    return characters.map((char) => {
      const row = scenes.map((scene) => {
        const isPov = scene.povCharacterId === char.id;
        // In a real app, we'd have a 'charactersInScene' array.
        // For now, we'll assume if they are POV they are there.
        // We can also check if they are mentioned in the summary.
        const isMentioned = scene.summary?.includes(char.name) || scene.notes?.includes(char.name);

        const hasIssue = issues.some(
          (i) =>
            !i.resolved &&
            i.relatedEntityIds?.includes(char.id) &&
            i.relatedEntityIds?.includes(scene.id)
        );

        return {
          sceneId: scene.id,
          status: isPov ? 'pov' : isMentioned ? 'mentioned' : 'none',
          hasIssue,
        };
      });
      return { char, row };
    });
  }, [characters, scenes, issues]);

  return (
    <div className="overflow-x-auto bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Consistency Matrix</h2>
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300 sticky left-0 bg-gray-900 z-10">
                Character / Scene
              </th>
              {scenes.map((scene) => (
                <th
                  key={scene.id}
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300 min-w-[150px]"
                >
                  <div className="truncate w-32" title={scene.title}>
                    {scene.title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {matrix.map(({ char, row }) => (
              <tr key={char.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-white sticky left-0 bg-gray-800 z-10 border-r border-gray-700">
                  {char.name}
                </td>
                {row.map((cell) => (
                  <td
                    key={cell.sceneId}
                    className={`whitespace-nowrap px-3 py-4 text-sm text-center border-l border-gray-700/50 ${
                      cell.hasIssue ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {cell.status === 'pov' && (
                        <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
                          POV
                        </span>
                      )}
                      {cell.status === 'mentioned' && (
                        <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                          Mentioned
                        </span>
                      )}
                      {cell.status === 'none' && <span className="text-gray-600">-</span>}

                      {cell.hasIssue && (
                        <AlertCircle
                          className="h-4 w-4 text-red-400"
                          aria-label="Continuity Issue"
                        />
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
