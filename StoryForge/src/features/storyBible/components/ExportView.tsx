import React, { useState, useEffect, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { downloadJson, copyToClipboard } from '@/utils/exportUtils';
import type { PlotNode } from '@/types/story';
import { Copy, Download, RefreshCw } from 'lucide-react';

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
      setCopyFeedback('Failed');
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

  if (!project) return <div className="p-6 text-sf-text-muted">Project not found.</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-sf-border">
        <h2 className="text-lg font-bold text-sf-text">Export</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSummaryText(generatedSummary)}
            className="btn-ghost text-sm flex items-center gap-2"
            title="Regenerate"
          >
            <RefreshCw size={14} />
          </button>
          <button onClick={handleCopy} className="btn-secondary text-sm flex items-center gap-2">
            <Copy size={14} />
            {copyFeedback || 'Copy'}
          </button>
          <button
            onClick={handleDownloadJson}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Download size={14} />
            JSON
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <label
          htmlFor="summary-text"
          className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2"
        >
          Project Summary
        </label>
        <textarea
          id="summary-text"
          className="flex-1 w-full bg-sf-surface border border-sf-border rounded-sm p-4 text-sf-text font-mono text-sm focus:border-sf-text outline-none resize-none"
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-sf-text-muted">
          You can edit this summary before copying. Changes here are not saved to the project.
        </p>
      </div>
    </div>
  );
};
