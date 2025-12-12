import React, { useState } from 'react';
import {
    Users, MapPin, Package, Database, BookOpen, Download,
    ChevronRight, ChevronDown, Plus, Search
} from 'lucide-react';
import type { Character, Location, StoryItem as Item } from '@/types/story';

export type SectionType = 'characters' | 'locations' | 'items' | 'variables' | 'rules' | 'exports';

interface StorySidebarProps {
    activeSection: SectionType;
    selectedItemId: string | null;
    onNavigate: (section: SectionType, itemId?: string) => void;
    onCreateItem: (type: 'character' | 'location' | 'item') => void;
    characters: Character[];
    locations: Location[];
    items: Item[];
}

export const StorySidebar: React.FC<StorySidebarProps> = ({
    activeSection,
    selectedItemId,
    onNavigate,
    onCreateItem,
    characters,
    locations,
    items,
}) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        characters: true,
        locations: true,
        items: true,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const NavItem = ({
        id,
        label,
        icon: Icon,
        isActive,
        onClick
    }: {
        id: string;
        label: string;
        icon: React.ElementType;
        isActive: boolean;
        onClick: () => void;
    }) => (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors
        ${isActive
                    ? 'text-white bg-gray-800 border-r-2 border-indigo-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}
      `}
        >
            <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-gray-500'} />
            {label}
        </button>
    );

    const SectionHeader = ({
        id,
        label,
        icon: Icon,
        count,
        onAdd
    }: {
        id: SectionType;
        label: string;
        icon: React.ElementType;
        count?: number;
        onAdd?: () => void;
    }) => (
        <div className="group flex items-center justify-between px-4 py-2 mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300">
            <button
                onClick={() => toggleSection(id)}
                className="flex items-center gap-2 flex-1 text-left"
            >
                {expandedSections[id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span className="flex items-center gap-2">
                    <Icon size={12} /> {label}
                </span>
                {count !== undefined && (
                    <span className="ml-auto text-[10px] bg-gray-800 px-1.5 py-0.5 rounded-full">
                        {count}
                    </span>
                )}
            </button>
            {onAdd && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-opacity"
                    title={`Add ${label}`}
                >
                    <Plus size={14} />
                </button>
            )}
        </div>
    );

    const SubItem = ({
        id,
        label,
        isActive,
        onClick
    }: {
        id: string;
        label: string;
        isActive: boolean;
        onClick: () => void;
    }) => (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center pl-10 pr-4 py-1.5 text-sm transition-colors border-l-2
        ${isActive
                    ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500'
                    : 'text-gray-400 hover:text-gray-200 border-transparent hover:border-gray-700'}
      `}
        >
            <span className="truncate">{label}</span>
        </button>
    );

    return (
        <div className="py-4 space-y-1">
            {/* Search Placeholder */}
            <div className="px-4 mb-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1.5 text-gray-600" size={14} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-900 border border-gray-800 rounded text-sm py-1 pl-8 pr-3 text-gray-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Characters */}
            <SectionHeader
                id="characters"
                label="Characters"
                icon={Users}
                count={characters.length}
                onAdd={() => onCreateItem('character')}
            />
            {expandedSections['characters'] && (
                <div className="mb-2">
                    {characters.map(char => (
                        <SubItem
                            key={char.id}
                            id={char.id}
                            label={char.name}
                            isActive={activeSection === 'characters' && selectedItemId === char.id}
                            onClick={() => onNavigate('characters', char.id)}
                        />
                    ))}
                    {characters.length === 0 && (
                        <div className="pl-10 py-1 text-xs text-gray-600 italic">No characters</div>
                    )}
                </div>
            )}

            {/* Locations */}
            <SectionHeader
                id="locations"
                label="Locations"
                icon={MapPin}
                count={locations.length}
                onAdd={() => onCreateItem('location')}
            />
            {expandedSections['locations'] && (
                <div className="mb-2">
                    {locations.map(loc => (
                        <SubItem
                            key={loc.id}
                            id={loc.id}
                            label={loc.name}
                            isActive={activeSection === 'locations' && selectedItemId === loc.id}
                            onClick={() => onNavigate('locations', loc.id)}
                        />
                    ))}
                    {locations.length === 0 && (
                        <div className="pl-10 py-1 text-xs text-gray-600 italic">No locations</div>
                    )}
                </div>
            )}

            {/* Items */}
            <SectionHeader
                id="items"
                label="Items"
                icon={Package}
                count={items.length}
                onAdd={() => onCreateItem('item')}
            />
            {expandedSections['items'] && (
                <div className="mb-2">
                    {items.map(item => (
                        <SubItem
                            key={item.id}
                            id={item.id}
                            label={item.name}
                            isActive={activeSection === 'items' && selectedItemId === item.id}
                            onClick={() => onNavigate('items', item.id)}
                        />
                    ))}
                    {items.length === 0 && (
                        <div className="pl-10 py-1 text-xs text-gray-600 italic">No items</div>
                    )}
                </div>
            )}

            <div className="my-4 border-t border-gray-800 mx-4" />

            {/* Other Sections */}
            <NavItem
                id="variables"
                label="Global Variables"
                icon={Database}
                isActive={activeSection === 'variables'}
                onClick={() => onNavigate('variables')}
            />
            <NavItem
                id="rules"
                label="World Rules"
                icon={BookOpen}
                isActive={activeSection === 'rules'}
                onClick={() => onNavigate('rules')}
            />
            <NavItem
                id="exports"
                label="Export / Print"
                icon={Download}
                isActive={activeSection === 'exports'}
                onClick={() => onNavigate('exports')}
            />
        </div>
    );
};
