import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../content');

function readAllContent(): Array<{ locale: string; file: string; content: string }> {
  const results: Array<{ locale: string; file: string; content: string }> = [];
  const locales = fs.readdirSync(CONTENT_DIR).filter((d) => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory());

  for (const locale of locales) {
    const dir = path.join(CONTENT_DIR, locale);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      results.push({ locale, file, content });
    }
  }
  return results;
}

describe('Content validation', () => {
  const allContent = readAllContent();

  it('should have non-empty content in all files', () => {
    for (const { locale, file, content } of allContent) {
      expect(content.trim().length, `${locale}/${file} is empty`).toBeGreaterThan(0);
    }
  });

  it('should have a title heading in each document', () => {
    for (const { locale, file, content } of allContent) {
      expect(content, `${locale}/${file} missing title`).toMatch(/^# .+/m);
    }
  });

  it('should have at least 100 characters of content', () => {
    for (const { locale, file, content } of allContent) {
      expect(content.length, `${locale}/${file} too short`).toBeGreaterThan(100);
    }
  });

  it('should not contain placeholder text', () => {
    const placeholders = ['TODO', 'FIXME', 'Lorem ipsum', 'placeholder', 'TBD'];
    for (const { locale, file, content } of allContent) {
      for (const ph of placeholders) {
        expect(content.toLowerCase(), `${locale}/${file} contains "${ph}"`).not.toContain(ph.toLowerCase());
      }
    }
  });

  it('should use proper markdown headings hierarchy', () => {
    for (const { locale, file, content } of allContent) {
      const headings = content.match(/^#{1,6} .+$/gm) || [];
      if (headings.length > 0) {
        const firstLevel = headings[0].match(/^(#+)/)?.[1].length ?? 1;
        expect(firstLevel, `${locale}/${file} should start with h1`).toBe(1);
      }
    }
  });
});
