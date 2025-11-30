/**
 * Core domain model for StoryForge.
 * Defines the shape of story projects, characters, plot nodes, and other entities.
 */

// --- Utility Types ---

export type EntityId = string;
export type Timestamp = string;

/**
 * Common metadata for entities.
 */
export interface Metadata {
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  confidence?: number; // 0-1
  custom?: Record<string, unknown>;
}

/**
 * Represents a single change record in an entity's history.
 */
export interface VersionRecord {
  id: string;
  timestamp: Timestamp;
  changes: Record<string, unknown>;
  authorId?: string;
}

/**
 * History of changes for an entity.
 */
export type VersionHistory = VersionRecord[];

// --- Core Entities ---

/**
 * Represents a single story project.
 */
export interface StoryProject {
  id: EntityId;
  title: string;
  subtitle?: string;
  status: 'planning' | 'drafting' | 'revising' | 'completed' | 'on_hold';
  genre?: string[];
  subgenres?: string[];
  themes?: string[];
  tone?: string;
  logline?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastUpdated?: Timestamp; // For display purposes, could be same as updatedAt
  isArchived?: boolean;
  stats?: {
    characterCount: number;
    sceneCount: number;
    issueCount: number;
    wordCount?: number;
  };

  // Metadata & Versioning
  metadata?: Metadata;
  versionHistory?: VersionHistory;
}

/**
 * Represents a character in the story.
 */
export interface Character {
  id: EntityId;
  projectId: EntityId;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'other';
  age?: string;
  traits?: string[];
  goals?: string;
  flaws?: string;
  backstory?: string;
  relationships: CharacterRelationship[];
  tags?: string[]; // Kept for backward compatibility, but metadata.tags is preferred
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Cross-references
  appearsInSceneIds?: EntityId[];

  // Metadata & Versioning
  metadata?: Metadata;
  versionHistory?: VersionHistory;
}

/**
 * Defines a relationship between two characters.
 */
export interface CharacterRelationship {
  characterId: EntityId;
  type: 'ally' | 'enemy' | 'family' | 'mentor' | 'romantic' | 'other';
  description?: string;
}

/**
 * Represents a physical or conceptual location in the story world.
 */
export interface Location {
  id: EntityId;
  projectId: EntityId;
  name: string;
  type?: string;
  description?: string;
  importantEvents?: string[];
  tags?: string[]; // Kept for backward compatibility
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Cross-references
  usedInSceneIds?: EntityId[];

  // Metadata & Versioning
  metadata?: Metadata;
  versionHistory?: VersionHistory;
}

/**
 * Represents an item or object of significance in the story.
 */
export interface StoryItem {
  id: EntityId;
  projectId: EntityId;
  name: string;
  type?: string;
  description?: string;
  importance?: 'minor' | 'major' | 'mcguffin';
  tags?: string[]; // Kept for backward compatibility
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Metadata & Versioning
  metadata?: Metadata;
  versionHistory?: VersionHistory;
}

/**
 * Represents a node in the plot structure (Act, Arc, Chapter, Scene).
 */
export interface PlotNode {
  id: EntityId;
  projectId: EntityId;
  parentId: EntityId | null;
  type: 'act' | 'arc' | 'chapter' | 'scene';
  title: string;
  summary?: string;
  order: number;
  povCharacterId?: EntityId;
  locationId?: EntityId;
  timelinePosition?: string;
  keywords?: string[];
  goals?: string;
  conflict?: string;
  outcome?: string;
  notes?: string;

  // Cross-references
  involvedCharacterIds?: EntityId[];
  involvedLocationIds?: EntityId[];

  // Metadata & Versioning
  metadata?: Metadata;
  versionHistory?: VersionHistory;
}

/**
 * Represents a variable or fact about the story world or logic.
 */
export interface StoryVariable {
  id: EntityId;
  projectId: EntityId;
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'rule';
  value: string;
  sourceIds?: EntityId[];
  description?: string;
  lastUpdated: Timestamp;

  // Metadata & Versioning
  metadata?: Metadata;
  versionHistory?: VersionHistory;
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
  id: EntityId;
  projectId: EntityId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Timestamp;
  contextSnapshot?: StoryContextSnapshot;
}

/**
 * Represents a detected continuity issue or logical inconsistency.
 */
export interface ContinuityIssue {
  id: EntityId;
  projectId: EntityId;
  type: 'character' | 'timeline' | 'world_rule' | 'logic' | 'other';
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  relatedEntityIds?: EntityId[];
  suggestedFix?: string;
  createdAt: Timestamp;
  resolved: boolean;
  resolvedAt?: Timestamp;
}
