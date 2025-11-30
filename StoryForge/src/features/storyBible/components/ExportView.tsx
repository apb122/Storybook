import React, { useState, useEffect, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { downloadJson, copyToClipboard } from '@/utils/exportUtils';
import type { PlotNode } from '@/types/story';

interface ExportViewProps {
  projectId: string;
}

export const ExportView: React.FC<ExportViewProps> = ({ projectId }) => {
  const store = useStoryStore();
  const [summaryText, setSummaryText] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  const project = store.projects.find((p) => p.id === projectId);
  const characters = store.characters.filter((c) => c.projectId === projectId);
  const locations = store.locations.filter((l) => l.projectId === projectId);
  const plotNodes = store.plotNodes
    .filter((n) => n.projectId === projectId)
    .sort((a, b) => a.order - b.order);
  const items = store.items.filter((i) => i.projectId === projectId);
  const variables = store.variables.filter((v) => v.projectId === projectId);
  const continuityIssues = store.continuityIssues.filter((i) => i.projectId === projectId);

  // Memoize the summary generation to avoid effect dependencies issues
  const generatedSummary = useMemo(() => {
    if (!project) return '';

    let text = `PROJECT: ${project.title}\n`;
    text += `=================================\n\n`;

    if (project.logline) text += `LOGLINE:\n${project.logline}\n\n`;
    if (project.genre) text += `GENRE: ${project.genre}\n`;
    if (project.subgenres?.length) text += `SUBGENRES: ${project.subgenres.join(', ')}\n`;
    if (project.themes?.length) text += `THEMES: ${project.themes.join(', ')}\n`;
    if (project.tone) text += `TONE: ${project.tone}\n`;

    text += `\nCHARACTERS\n`;
    text += `---------------------------------\n`;
    if (characters.length === 0) text += `(No characters defined)\n`;
    characters.forEach((char) => {
      text += `• ${char.name}`;
      if (char.role) text += ` (${char.role})`;
      text += `\n`;
      if (char.traits?.length) text += `  Traits: ${char.traits.join(', ')}\n`;
      if (char.notes) text += `  Notes: ${char.notes}\n`;
      text += `\n`;
    });

    text += `LOCATIONS\n`;
    text += `---------------------------------\n`;
    if (locations.length === 0) text += `(No locations defined)\n`;
    locations.forEach((loc) => {
      text += `• ${loc.name}\n`;
      if (loc.description) text += `  ${loc.description}\n`;
      text += `\n`;
    });

    text += `PLOT OUTLINE\n`;
    text += `---------------------------------\n`;

    const renderNode = (node: PlotNode, level: number) => {
      const indent = '  '.repeat(level);
      let nodeText = `${indent}${node.type.toUpperCase()}: ${node.title}\n`;
      if (node.summary) nodeText += `${indent}  ${node.summary}\n`;

      const children = plotNodes
        .filter((n) => n.parentId === node.id)
        .sort((a, b) => a.order - b.order);
      let childrenText = '';
      children.forEach((child) => {
        childrenText += renderNode(child, level + 1);
      });

      return nodeText + childrenText;
    };

    const rootNodes = plotNodes.filter((n) => !n.parentId);
    if (rootNodes.length === 0) text += `(No plot outline defined)\n`;
    rootNodes.forEach((node) => {
      text += renderNode(node, 0);
    });

    return text;
  }, [project, characters, locations, plotNodes]);

  useEffect(() => {
    setSummaryText(generatedSummary);
  }, [generatedSummary]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(summaryText);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch {
      setCopyFeedback('Failed to copy');
    }
  };

  const handleDownloadJson = () => {
    if (!project) return;

    const exportData = {
      project,
      characters,
      locations,
      items,
      plotNodes,
      variables,
      continuityIssues,
      exportDate: new Date().toISOString(),
      appVersion: '0.0.0',
    };

    const filename = `storyforge-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    downloadJson(filename, exportData);
  };

  if (!project) return <div className="p-6 text-gray-400">Project not found.</div>;

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <h2 className="text-xl font-bold text-white">Project Export</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setSummaryText(generatedSummary)}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Regenerate Summary
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors min-w-[80px]"
          >
            {copyFeedback || 'Copy to Clipboard'}
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Download JSON
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <label htmlFor="summary-text" className="block text-sm font-medium text-gray-400 mb-2">
          Project Summary
        </label>
        <textarea
          id="summary-text"
          title="Project Summary"
          className="flex-1 w-full bg-gray-950 border border-gray-700 rounded-md p-4 text-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-gray-500">
          This summary is generated from your project data. You can edit it before copying, but
          changes here won't be saved to the project.
        </p>
      </div>
    </div>
  );
};
