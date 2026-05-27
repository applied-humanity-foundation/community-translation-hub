interface MarkdownToken {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'blockquote' | 'hr' | 'blank';
  content: string;
  level?: number;
}

export function parseMarkdown(source: string): MarkdownToken[] {
  const lines = source.split('\n');
  const tokens: MarkdownToken[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      tokens.push({ type: 'blank', content: '' });
      i++;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      tokens.push({ type: 'heading', content: headingMatch[2], level: headingMatch[1].length });
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      tokens.push({ type: 'code', content: codeLines.join('\n') });
      i++;
      continue;
    }

    if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
      const listLines: string[] = [line];
      i++;
      while (i < lines.length && (lines[i].match(/^[-*+]\s/) || lines[i].match(/^\d+\.\s/) || lines[i].match(/^\s{2,}/))) {
        listLines.push(lines[i]);
        i++;
      }
      tokens.push({ type: 'list', content: listLines.join('\n') });
      continue;
    }

    if (line.startsWith('>')) {
      const quoteLines: string[] = [line.replace(/^>\s?/, '')];
      i++;
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      tokens.push({ type: 'blockquote', content: quoteLines.join('\n') });
      continue;
    }

    if (line.match(/^[-*_]{3,}$/)) {
      tokens.push({ type: 'hr', content: '' });
      i++;
      continue;
    }

    const paraLines: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^#{1,6}\s/) && !lines[i].startsWith('```') && !lines[i].startsWith('>')) {
      paraLines.push(lines[i]);
      i++;
    }
    tokens.push({ type: 'paragraph', content: paraLines.join('\n') });
  }

  return tokens;
}

export function renderMarkdownToHtml(source: string): string {
  const tokens = parseMarkdown(source);
  return tokens
    .map((token) => {
      switch (token.type) {
        case 'heading':
          return `<h${token.level}>${inlineMarkdown(token.content)}</h${token.level}>`;
        case 'paragraph':
          return `<p>${inlineMarkdown(token.content)}</p>`;
        case 'code':
          return `<pre><code>${escapeHtml(token.content)}</code></pre>`;
        case 'list':
          return renderList(token.content);
        case 'blockquote':
          return `<blockquote>${inlineMarkdown(token.content)}</blockquote>`;
        case 'hr':
          return '<hr/>';
        case 'blank':
          return '';
        default:
          return `<p>${token.content}</p>`;
      }
    })
    .filter(Boolean)
    .join('\n');
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

function renderList(content: string): string {
  const items = content.split('\n').filter(Boolean);
  const isOrdered = /^\d+\./.test(items[0]);
  const tag = isOrdered ? 'ol' : 'ul';
  const lis = items.map((item) => {
    const text = item.replace(/^[-*+]\s|^\d+\.\s/, '');
    return `<li>${inlineMarkdown(text)}</li>`;
  });
  return `<${tag}>${lis.join('')}</${tag}>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
  return text.replace(/[&<>]/g, (c) => map[c] || c);
}

export function extractHeadings(source: string): Array<{ level: number; text: string }> {
  return parseMarkdown(source)
    .filter((t) => t.type === 'heading')
    .map((t) => ({ level: t.level!, text: t.content }));
}

export function wordCount(source: string): number {
  const cleaned = source.replace(/[#*_`\[\]()>-]/g, ' ');
  const cjk = (cleaned.match(/[一-鿿㐀-䶿]/g) || []).length;
  const latin = cleaned.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)).length;
  return cjk + latin;
}
