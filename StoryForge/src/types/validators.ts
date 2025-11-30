import { z } from 'zod';
import type {
  StoryProject,
  Character,
  Location,
  StoryItem,
  PlotNode,
  StoryVariable,
} from './story';

// --- Utility Schemas ---

export const EntityIdSchema = z.string();
export const TimestampSchema = z.string();

export const MetadataSchema = z.object({
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  confidence: z.number().min(0).max(1).optional(),
  custom: z.record(z.unknown()).optional(),
});

export const VersionRecordSchema = z.object({
  id: z.string(),
  timestamp: TimestampSchema,
  changes: z.record(z.unknown()),
  authorId: z.string().optional(),
});

export const VersionHistorySchema = z.array(VersionRecordSchema);

// --- Core Entity Schemas ---

export const StoryProjectSchema = z.object({
  id: EntityIdSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  status: z.enum(['planning', 'drafting', 'revising', 'completed', 'on_hold']),
  genre: z.array(z.string()).optional(),
  subgenres: z.array(z.string()).optional(),
  themes: z.array(z.string()).optional(),
  tone: z.string().optional(),
  logline: z.string().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  lastUpdated: TimestampSchema.optional(),
  isArchived: z.boolean().optional(),
  stats: z
    .object({
      characterCount: z.number(),
      sceneCount: z.number(),
      issueCount: z.number(),
      wordCount: z.number().optional(),
    })
    .optional(),
  metadata: MetadataSchema.optional(),
  versionHistory: VersionHistorySchema.optional(),
});

export const CharacterRelationshipSchema = z.object({
  characterId: EntityIdSchema,
  type: z.enum(['ally', 'enemy', 'family', 'mentor', 'romantic', 'other']),
  description: z.string().optional(),
});

export const CharacterSchema = z.object({
  id: EntityIdSchema,
  projectId: EntityIdSchema,
  name: z.string().min(1),
  role: z.enum(['protagonist', 'antagonist', 'supporting', 'other']),
  age: z.string().optional(),
  traits: z.array(z.string()).optional(),
  goals: z.string().optional(),
  flaws: z.string().optional(),
  backstory: z.string().optional(),
  relationships: z.array(CharacterRelationshipSchema),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  appearsInSceneIds: z.array(EntityIdSchema).optional(),
  metadata: MetadataSchema.optional(),
  versionHistory: VersionHistorySchema.optional(),
});

export const LocationSchema = z.object({
  id: EntityIdSchema,
  projectId: EntityIdSchema,
  name: z.string().min(1),
  type: z.string().optional(),
  description: z.string().optional(),
  importantEvents: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  usedInSceneIds: z.array(EntityIdSchema).optional(),
  metadata: MetadataSchema.optional(),
  versionHistory: VersionHistorySchema.optional(),
});

export const StoryItemSchema = z.object({
  id: EntityIdSchema,
  projectId: EntityIdSchema,
  name: z.string().min(1),
  type: z.string().optional(),
  description: z.string().optional(),
  importantEvents: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  metadata: MetadataSchema.optional(),
  versionHistory: VersionHistorySchema.optional(),
});

export const PlotNodeSchema = z.object({
  id: EntityIdSchema,
  projectId: EntityIdSchema,
  parentId: EntityIdSchema.nullable(),
  type: z.enum(['act', 'arc', 'chapter', 'scene']),
  title: z.string().min(1),
  summary: z.string().optional(),
  order: z.number(),
  povCharacterId: EntityIdSchema.optional(),
  locationId: EntityIdSchema.optional(),
  timelinePosition: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  goals: z.string().optional(),
  conflict: z.string().optional(),
  outcome: z.string().optional(),
  notes: z.string().optional(),
  involvedCharacterIds: z.array(EntityIdSchema).optional(),
  involvedLocationIds: z.array(EntityIdSchema).optional(),
  metadata: MetadataSchema.optional(),
  versionHistory: VersionHistorySchema.optional(),
});

export const StoryVariableSchema = z.object({
  id: EntityIdSchema,
  projectId: EntityIdSchema,
  key: z.string().min(1),
  label: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'enum', 'rule']),
  value: z.string(),
  status: z.enum(['tentative', 'confirmed', 'locked']),
  tags: z.array(z.string()),
  sourceIds: z.array(EntityIdSchema).optional(),
  description: z.string().optional(),
  lastUpdated: TimestampSchema,
  metadata: MetadataSchema.optional(),
  versionHistory: VersionHistorySchema.optional(),
});

// --- Validation Functions ---

export const validateStoryProject = (data: unknown): StoryProject => StoryProjectSchema.parse(data);
export const validateCharacter = (data: unknown): Character => CharacterSchema.parse(data);
export const validateLocation = (data: unknown): Location => LocationSchema.parse(data);
export const validateStoryItem = (data: unknown): StoryItem => StoryItemSchema.parse(data);
export const validatePlotNode = (data: unknown): PlotNode => PlotNodeSchema.parse(data);
export const validateStoryVariable = (data: unknown): StoryVariable =>
  StoryVariableSchema.parse(data);

// --- Factory Functions ---

export const createEmptyProject = (): StoryProject => ({
  id: crypto.randomUUID(),
  title: 'Untitled Project',
  status: 'planning',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  genre: [],
  subgenres: [],
  themes: [],
  stats: {
    characterCount: 0,
    sceneCount: 0,
    issueCount: 0,
  },
});
