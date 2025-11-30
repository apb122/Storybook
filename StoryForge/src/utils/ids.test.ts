import { describe, it, expect } from 'vitest';
import { generateId } from './ids';

describe('generateId', () => {
  it('should generate a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should have a reasonable length', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });
});
