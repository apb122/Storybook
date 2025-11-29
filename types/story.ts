/**
 * StoryForge Domain Model Types
 *
 * This module defines all core entities and types for the story-planning application.
 * Each interface represents a distinct domain concept with strong type safety.
 */

/**
 * Represents a story project - the root entity containing all story planning data.
 * A project encapsulates the entire narrative work with metadata and current state.
 *
 * @property id - Unique identifier for the project
 * @property title - Primary title of the story
 * @property subtitle - Optional secondary title or tagline
 * @property status - Current development stage of the story
 * @property genre - Primary genre classification (e.g., "Fantasy", "Mystery")
 * @property subgenres - Additional genre classifications for finer categorization
 * @property themes - Central thematic elements explored in the story
 * @property tone - Narrative voice and mood (e.g., "Dark", "Comedic", "Introspective")
 * @property logline - One-sentence summary of the story's central conflict
 * @property createdAt - ISO 8601 timestamp of project creation
 * @property updatedAt - ISO 8601 timestamp of last modification
 */
export interface StoryProject {
  id: string
  title: string
  subtitle?: string
  status: 'planning' | 'drafting' | 'revising' | 'on_hold'
  genre?: string
  subgenres?: string[]
  themes?: string[]
  tone?: string
  logline?: string
  createdAt: string
  updatedAt: string
}

/**
 * Represents a character in the story with personality, background, and relationships.
 * Characters are the actors in narrative and can have complex interconnections.
 *
 * @property id - Unique identifier for the character
 * @property projectId - Reference to parent StoryProject
 * @property name - Character's name or designation
 * @property role - Functional role in the narrative structure
 * @property age - Character's age (can be approximate or symbolic)
 * @property traits - Distinguishing characteristics (e.g., "witty", "ambitious")
 * @property goals - What the character wants to achieve
 * @property flaws - Character weaknesses or internal conflicts
 * @property backstory - History and origin of the character
 * @property relationships - Array of connections to other characters
 * @property tags - Custom metadata tags for organization and filtering
 * @property notes - Writer's notes and additional context
 */
export interface Character {
  id: string
  projectId: string
  name: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'other'
  age?: string
  traits?: string[]
  goals?: string
  flaws?: string
  backstory?: string
  relationships: CharacterRelationship[]
  tags?: string[]
  notes?: string
}

/**
 * Describes the relationship between two characters.
 * Captures the nature and context of character-to-character connections.
 *
 * @property characterId - Reference to the related Character
 * @property type - Classification of the relationship
 * @property description - Contextual details about the relationship
 */
export interface CharacterRelationship {
  characterId: string
  type: 'ally' | 'enemy' | 'family' | 'mentor' | 'romantic' | 'other'
  description?: string
}

/**
 * Represents a location or setting in the story world.
 * Locations provide context for scenes and can influence plot development.
 *
 * @property id - Unique identifier for the location
 * @property projectId - Reference to parent StoryProject
 * @property name - Name of the location
 * @property type - Classification (e.g., "City", "Building", "Landmark")
 * @property description - Physical and cultural details of the location
 * @property importantEvents - Key events that occur at this location
 * @property tags - Custom metadata tags for organization
 */
export interface Location {
  id: string
  projectId: string
  name: string
  type?: string
  description?: string
  importantEvents?: string[]
  tags?: string[]
}

/**
 * Represents a significant object, artifact, or item in the story.
 * Items can be plot devices, magical artifacts, or important possessions.
 *
 * @property id - Unique identifier for the item
 * @property projectId - Reference to parent StoryProject
 * @property name - Item name or designation
 * @property type - Classification (e.g., "Weapon", "Artifact", "Key Object")
 * @property description - Physical description and relevant properties
 * @property importance - Narrative significance of the item
 * @property tags - Custom metadata tags for organization
 */
export interface StoryItem {
  id: string
  projectId: string
  name: string
  type?: string
  description?: string
  importance?: 'minor' | 'major' | 'mcguffin'
  tags?: string[]
}

/**
 * Represents a structural unit in the plot hierarchy.
 * PlotNodes form a tree structure enabling multi-level narrative organization
 * from acts down to individual scenes.
 *
 * @property id - Unique identifier for the plot node
 * @property projectId - Reference to parent StoryProject
 * @property parentId - Reference to parent PlotNode (null for root-level acts)
 * @property type - Hierarchical level in the story structure
 * @property title - Name of this plot unit
 * @property summary - Brief description of events and purpose
 * @property order - Numerical position among siblings for sequencing
 * @property povCharacterId - Character from whose perspective this scene is told
 * @property locationId - Reference to the Location where this occurs
 * @property timelinePosition - Position in story timeline (absolute or relative)
 * @property keywords - Key topics and plot elements
 * @property goals - What should be accomplished in this unit
 * @property conflict - Central tension or challenge in this unit
 * @property outcome - How the conflict resolves or progresses
 * @property notes - Writer's notes and reminders
 */
export interface PlotNode {
  id: string
  projectId: string
  parentId: string | null
  type: 'act' | 'arc' | 'chapter' | 'scene'
  title: string
  summary?: string
  order: number
  povCharacterId?: string
  locationId?: string
  timelinePosition?: string
  keywords?: string[]
  goals?: string
  conflict?: string
  outcome?: string
  notes?: string
}

/**
 * Represents a story variable or world rule used in the narrative.
 * Variables track information that changes or is referenced throughout the story
 * (e.g., character stats, world rules, discovered facts).
 *
 * @property id - Unique identifier for the variable
 * @property projectId - Reference to parent StoryProject
 * @property key - Machine-readable identifier for the variable
 * @property label - Human-readable display name
 * @property type - Data type and validation rule for the variable
 * @property value - Current value of the variable
 * @property sourceIds - References to plot nodes or scenes where variable is used
 * @property description - Explanation of what this variable represents
 * @property lastUpdated - ISO 8601 timestamp of last change
 */
export interface StoryVariable {
  id: string
  projectId: string
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'enum' | 'rule'
  value: string
  sourceIds?: string[]
  description?: string
  lastUpdated: string
}

/**
 * Captures a snapshot of story context at a point in time.
 * Used in AI messages to provide historical context for conversational continuity.
 *
 * @property projectSummary - High-level overview of the entire story
 * @property keyCharacters - List of main character names for reference
 * @property currentPlotNodeSummary - Summary of the current scene/plot point
 * @property namedVariables - Key story variables and their values
 */
export interface StoryContextSnapshot {
  projectSummary: string
  keyCharacters: string[]
  currentPlotNodeSummary?: string
  namedVariables: Record<string, string>
}

/**
 * Represents a message in a conversation thread with the AI.
 * Messages maintain context snapshots for debugging and maintaining coherence.
 *
 * @property id - Unique identifier for the message
 * @property projectId - Reference to parent StoryProject
 * @property role - Participant in the conversation
 * @property content - The message text content
 * @property createdAt - ISO 8601 timestamp of message creation
 * @property contextSnapshot - Story context at time of message
 */
export interface AiMessage {
  id: string
  projectId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  contextSnapshot?: StoryContextSnapshot
}

/**
 * Represents a detected inconsistency or issue in story continuity.
 * Used to track logical problems, character inconsistencies, timeline conflicts, etc.
 * Can be flagged by AI or manually by the writer.
 *
 * @property id - Unique identifier for the issue
 * @property projectId - Reference to parent StoryProject
 * @property type - Category of continuity problem
 * @property description - Clear explanation of the issue
 * @property severity - Impact level on story coherence
 * @property relatedEntityIds - References to entities involved in the issue
 * @property suggestedFix - AI-generated suggestion for resolving the issue
 * @property createdAt - ISO 8601 timestamp when issue was detected
 * @property resolved - Whether the issue has been addressed
 * @property resolvedAt - ISO 8601 timestamp when marked as resolved
 */
export interface ContinuityIssue {
  id: string
  projectId: string
  type: 'character' | 'timeline' | 'world_rule' | 'logic' | 'other'
  description: string
  severity: 'minor' | 'moderate' | 'major'
  relatedEntityIds?: string[]
  suggestedFix?: string
  createdAt: string
  resolved: boolean
  resolvedAt?: string
}
