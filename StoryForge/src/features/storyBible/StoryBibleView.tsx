import React, { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { CharacterTab } from './components/CharacterTab';
import { LocationTab } from './components/LocationTab';
import { ItemTab } from './components/ItemTab';

interface StoryBibleViewProps {
    projectId: string;
}

export const StoryBibleView: React.FC<StoryBibleViewProps> = ({ projectId }) => {
    const [activeTab, setActiveTab] = useState('characters');

    const tabs = [
        { id: 'characters', label: 'Characters' },
        { id: 'locations', label: 'Locations' },
        { id: 'items', label: 'Items' },
    ];

    return (
        <div className="space-y-6">
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="h-full">
                {activeTab === 'characters' && <CharacterTab projectId={projectId} />}
                {activeTab === 'locations' && <LocationTab projectId={projectId} />}
                {activeTab === 'items' && <ItemTab projectId={projectId} />}
            </div>
        </div>
    );
};
