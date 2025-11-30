/**
 * Core domain model for StoryForge.
 * Defines the shape of story projects, characters, plot nodes, and other entities.
 */

/**
 * Represents a single story project.
 */
export interface StoryProject {
    id: string;
    title: string;
    subtitle?: string;
    status: "planning" | "drafting" | "revising" | "on_hold";
    genre?: string;
    subgenres?: string[];
    themes?: string[];
    tone?: string;
    logline?: string;
    createdAt: string;
    updatedAt: string;
    isArchived?: boolean;
}

/**
 * Represents a character in the story.
 */
export interface Character {
    id: string;
    projectId: string;
    name: string;
    role: "protagonist" | "antagonist" | "supporting" | "other";
    age?: string;
    traits?: string[];
    goals?: string;
    flaws?: string;
    backstory?: string;
    relationships: CharacterRelationship[];
    tags?: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Defines a relationship between two characters.
 */
export interface CharacterRelationship {
    characterId: string;
    type: "ally" | "enemy" | "family" | "mentor" | "romantic" | "other";
    description?: string;
}

/**
 * Represents a physical or conceptual location in the story world.
 */
export interface Location {
    id: string;
    projectId: string;
    name: string;
    type?: string;
    description?: string;
    importantEvents?: string[];
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Represents an item or object of significance in the story.
 */
export interface StoryItem {
    id: string;
    projectId: string;
    name: string;
    type?: string;
    description?: string;
    importance?: "minor" | "major" | "mcguffin";
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Represents a node in the plot structure (Act, Arc, Chapter, Scene).
 */
export interface PlotNode {
    id: string;
    projectId: string;
    parentId: string | null;
    type: "act" | "arc" | "chapter" | "scene";
    title: string;
    summary?: string;
    order: number;
    povCharacterId?: string;
    locationId?: string;
    timelinePosition?: string;
    keywords?: string[];
    goals?: string;
    conflict?: string;
    outcome?: string;
    notes?: string;
}

/**
 * Represents a variable or fact about the story world or logic.
 */
export interface StoryVariable {
    id: string;
    projectId: string;
    key: string;
    label: string;
    type: "string" | "number" | "boolean" | "enum" | "rule";
    value: string;
    sourceIds?: string[];
    description?: string;
    lastUpdated: string;
}

/**
 * A snapshot of the story context at a given point, used for AI context.
 */
export interface StoryContextSnapshot {
    projectSummary: string;
    keyCharacters: string[];
    currentPlotNodeSummary?: string;
    namedVariables: Record<string, string>;
}

/**
 * Represents a message in the AI chat history.
 */
export interface AiMessage {
    id: string;
    projectId: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: string;
    contextSnapshot?: StoryContextSnapshot;
}

/**
 * Represents a detected continuity issue or logical inconsistency.
 */
export interface ContinuityIssue {
    id: string;
    projectId: string;
    type: "character" | "timeline" | "world_rule" | "logic" | "other";
    description: string;
    severity: "minor" | "moderate" | "major";
    relatedEntityIds?: string[];
    suggestedFix?: string;
    createdAt: string;
    resolved: boolean;
    resolvedAt?: string;
}
