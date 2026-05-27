import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../content');
const SUPPORTED_LOCALES = ['en', 'zh'];

function getDocuments(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
}

describe('Translation completeness', () => {
  const enDocs = getDocuments('en');
  const zhDocs = getDocuments('zh');

  it('should have at least one English document', () => {
    expect(enDocs.length).toBeGreaterThan(0);
  });

  it('should have matching documents in all locales', () => {
    for (const doc of enDocs) {
      expect(zhDocs).toContain(doc);
    }
  });

  it('should not have orphan translations without source', () => {
    for (const doc of zhDocs) {
      expect(enDocs).toContain(doc);
    }
  });

  it('should have content directories for all supported locales', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dir = path.join(CONTENT_DIR, locale);
      expect(fs.existsSync(dir)).toBe(true);
    }
  });
});
