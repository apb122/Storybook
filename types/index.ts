/**
 * StoryForge Type Definitions
 *
 * Central export point for all type definitions in the application.
 * Provides unified access to the domain model and ensures type consistency
 * across features, state management, and API contracts.
 *
 * @example
 * import type {
 *   StoryProject,
 *   Character,
 *   PlotNode,
 * } from '@/types'
 */

export type {
  StoryProject,
  Character,
  CharacterRelationship,
  Location,
  StoryItem,
  PlotNode,
  StoryVariable,
  StoryContextSnapshot,
  AiMessage,
  ContinuityIssue,
} from './story'
