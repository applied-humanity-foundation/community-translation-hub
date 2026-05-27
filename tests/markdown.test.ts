import { describe, it, expect } from 'vitest';
import { parseMarkdown, renderMarkdownToHtml, extractHeadings, wordCount } from '../src/utils/markdown';

describe('parseMarkdown', () => {
  it('should parse headings', () => {
    const tokens = parseMarkdown('# Title\n\n## Subtitle');
    const headings = tokens.filter((t) => t.type === 'heading');
    expect(headings).toHaveLength(2);
    expect(headings[0].content).toBe('Title');
    expect(headings[0].level).toBe(1);
    expect(headings[1].content).toBe('Subtitle');
    expect(headings[1].level).toBe(2);
  });

  it('should parse paragraphs', () => {
    const tokens = parseMarkdown('Hello world\nSecond line');
    const paragraphs = tokens.filter((t) => t.type === 'paragraph');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].content).toContain('Hello world');
  });

  it('should parse code blocks', () => {
    const tokens = parseMarkdown('```\nconst x = 1;\n```');
    const code = tokens.filter((t) => t.type === 'code');
    expect(code).toHaveLength(1);
    expect(code[0].content).toBe('const x = 1;');
  });

  it('should parse lists', () => {
    const tokens = parseMarkdown('- item 1\n- item 2\n- item 3');
    const lists = tokens.filter((t) => t.type === 'list');
    expect(lists).toHaveLength(1);
    expect(lists[0].content).toContain('item 1');
  });

  it('should parse blockquotes', () => {
    const tokens = parseMarkdown('> This is a quote');
    const quotes = tokens.filter((t) => t.type === 'blockquote');
    expect(quotes).toHaveLength(1);
    expect(quotes[0].content).toBe('This is a quote');
  });
});

describe('renderMarkdownToHtml', () => {
  it('should render headings as HTML', () => {
    const html = renderMarkdownToHtml('# Hello');
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('should render inline formatting', () => {
    const html = renderMarkdownToHtml('This is **bold** and *italic*');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('should render links', () => {
    const html = renderMarkdownToHtml('[Click](https://example.com)');
    expect(html).toContain('<a href="https://example.com">Click</a>');
  });
});

describe('extractHeadings', () => {
  it('should extract all headings with levels', () => {
    const headings = extractHeadings('# H1\n\n## H2\n\n### H3');
    expect(headings).toEqual([
      { level: 1, text: 'H1' },
      { level: 2, text: 'H2' },
      { level: 3, text: 'H3' },
    ]);
  });
});

describe('wordCount', () => {
  it('should count English words', () => {
    expect(wordCount('Hello world foo bar')).toBe(4);
  });

  it('should count Chinese characters', () => {
    expect(wordCount('你好世界')).toBe(4);
  });

  it('should count mixed content', () => {
    const count = wordCount('Hello 你好 world 世界');
    expect(count).toBeGreaterThanOrEqual(4);
  });

  it('should ignore markdown syntax', () => {
    expect(wordCount('# **Hello** world')).toBe(2);
  });
});
