import { z } from 'zod';
import { generateId } from '@/utils/ids';
import type {
  ManuscriptContent,
  ManuscriptTarget,
  ManuscriptComment,
  ManuscriptSnapshot,
} from './story';

// Import shared schemas from validators
import { EntityIdSchema, TimestampSchema } from './validators';

// --- Manuscript Schemas ---

export const ManuscriptContentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(z.record(z.unknown())),
});

export const ManuscriptTargetSchema = z.object({
  targetWords: z.number().positive(),
  deadline: TimestampSchema.optional(),
  projectId: EntityIdSchema,
});

export const ManuscriptCommentSchema = z.object({
  id: EntityIdSchema,
  sceneId: EntityIdSchema,
  projectId: EntityIdSchema,
  authorId: z.string().optional(),
  content: z.string(),
  position: z.number(),
  resolved: z.boolean(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const ManuscriptSnapshotSchema = z.object({
  id: EntityIdSchema,
  sceneId: EntityIdSchema,
  projectId: EntityIdSchema,
  label: z.string(),
  content: ManuscriptContentSchema,
  wordCount: z.number(),
  createdAt: TimestampSchema,
});

// --- Manuscript Validators ---

export function validateManuscriptContent(data: unknown): ManuscriptContent {
  return ManuscriptContentSchema.parse(data);
}

export function validateManuscriptTarget(data: unknown): ManuscriptTarget {
  return ManuscriptTargetSchema.parse(data);
}

export function validateManuscriptComment(data: unknown): ManuscriptComment {
  return ManuscriptCommentSchema.parse(data);
}

export function validateManuscriptSnapshot(data: unknown): ManuscriptSnapshot {
  return ManuscriptSnapshotSchema.parse(data);
}

// --- Manuscript Factory Functions ---

export function createEmptyManuscriptContent(): ManuscriptContent {
  return {
    type: 'doc',
    content: [],
  };
}

export function createManuscriptComment(
  sceneId: string,
  projectId: string,
  content: string,
  position: number
): ManuscriptComment {
  return {
    id: generateId(),
    sceneId,
    projectId,
    content,
    position,
    resolved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createManuscriptSnapshot(
  sceneId: string,
  projectId: string,
  label: string,
  content: ManuscriptContent,
  wordCount: number
): ManuscriptSnapshot {
  return {
    id: generateId(),
    sceneId,
    projectId,
    label,
    content,
    wordCount,
    createdAt: new Date().toISOString(),
  };
}
