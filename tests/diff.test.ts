import { describe, it, expect } from 'vitest';
import { computeDiff, diffStats } from '../src/utils/diff';

describe('computeDiff', () => {
  it('should detect unchanged lines', () => {
    const result = computeDiff('line 1\nline 2', 'line 1\nline 2');
    expect(result.every((r) => r.type === 'unchanged')).toBe(true);
  });

  it('should detect added lines', () => {
    const result = computeDiff('line 1', 'line 1\nline 2');
    const added = result.filter((r) => r.type === 'added');
    expect(added).toHaveLength(1);
    expect(added[0].value).toBe('line 2');
  });

  it('should detect removed lines', () => {
    const result = computeDiff('line 1\nline 2', 'line 1');
    const removed = result.filter((r) => r.type === 'removed');
    expect(removed).toHaveLength(1);
    expect(removed[0].value).toBe('line 2');
  });

  it('should handle completely different content', () => {
    const result = computeDiff('old content', 'new content');
    expect(result.some((r) => r.type === 'added')).toBe(true);
    expect(result.some((r) => r.type === 'removed')).toBe(true);
  });

  it('should handle empty strings', () => {
    const result = computeDiff('', 'new line');
    const added = result.filter((r) => r.type === 'added');
    expect(added).toHaveLength(1);
  });
});

describe('diffStats', () => {
  it('should count diff types correctly', () => {
    const diffs = computeDiff('line 1\nline 2\nline 3', 'line 1\nchanged\nline 3');
    const stats = diffStats(diffs);
    expect(stats.unchanged).toBeGreaterThanOrEqual(2);
    expect(stats.added + stats.removed).toBeGreaterThanOrEqual(1);
  });

  it('should return zeros for identical content', () => {
    const diffs = computeDiff('same', 'same');
    const stats = diffStats(diffs);
    expect(stats.added).toBe(0);
    expect(stats.removed).toBe(0);
    expect(stats.unchanged).toBe(1);
  });
});
