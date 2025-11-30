import React, { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CharacterTab } from './components/CharacterTab';
import { LocationTab } from './components/LocationTab';
import { ItemTab } from './components/ItemTab';
import { RulesTab } from './components/RulesTab';
import { StoryVariablesPanel } from './components/StoryVariablesPanel';
import { ExportView } from './components/ExportView';
import { Users, MapPin, Package, Database, Download, BookOpen } from 'lucide-react';

interface StoryBibleViewProps {
  projectId: string;
}

export const StoryBibleView: React.FC<StoryBibleViewProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('characters');

  const tabs = [
    { id: 'characters', label: 'Characters', icon: <Users size={16} /> },
    { id: 'locations', label: 'Locations', icon: <MapPin size={16} /> },
    { id: 'items', label: 'Items', icon: <Package size={16} /> },
    { id: 'variables', label: 'Variables', icon: <Database size={16} /> },
    { id: 'rules', label: 'Rules', icon: <BookOpen size={16} /> },
    { id: 'exports', label: 'Exports', icon: <Download size={16} /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-sf-text mb-6">Story Bible</h1>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex-1 min-h-0 bg-sf-surface border border-sf-border rounded-sm overflow-hidden">
        {activeTab === 'characters' && <CharacterTab projectId={projectId} />}
        {activeTab === 'locations' && <LocationTab projectId={projectId} />}
        {activeTab === 'items' && <ItemTab projectId={projectId} />}
        {activeTab === 'variables' && <StoryVariablesPanel projectId={projectId} />}
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'exports' && <ExportView projectId={projectId} />}
      </div>
    </div>
  );
};
