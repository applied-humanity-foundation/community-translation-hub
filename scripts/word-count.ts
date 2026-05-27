import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../content');

interface WordCountEntry {
  locale: string;
  document: string;
  words: number;
  characters: number;
  lines: number;
}

function countStats(text: string): { words: number; characters: number; lines: number } {
  const lines = text.split('\n').length;
  const characters = text.length;
  const cleaned = text.replace(/[#*_`\[\]()>-]/g, ' ');
  const cjk = (cleaned.match(/[一-鿿㐀-䶿]/g) || []).length;
  const latin = cleaned.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)).length;
  return { words: cjk + latin, characters, lines };
}

function main(): void {
  const entries: WordCountEntry[] = [];
  const locales = fs.readdirSync(CONTENT_DIR).filter((d) => {
    return fs.statSync(path.join(CONTENT_DIR, d)).isDirectory();
  });

  for (const locale of locales) {
    const dir = path.join(CONTENT_DIR, locale);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const stats = countStats(content);
      entries.push({
        locale,
        document: file.replace('.md', ''),
        ...stats,
      });
    }
  }

  console.log('Word Count Report\n');
  console.log('Document'.padEnd(40) + 'Locale'.padEnd(8) + 'Words'.padEnd(10) + 'Chars'.padEnd(10) + 'Lines');
  console.log('-'.repeat(78));

  for (const entry of entries.sort((a, b) => a.document.localeCompare(b.document) || a.locale.localeCompare(b.locale))) {
    console.log(
      entry.document.padEnd(40) +
        entry.locale.padEnd(8) +
        String(entry.words).padEnd(10) +
        String(entry.characters).padEnd(10) +
        String(entry.lines)
    );
  }

  const totalWords = entries.reduce((sum, e) => sum + e.words, 0);
  const totalChars = entries.reduce((sum, e) => sum + e.characters, 0);
  console.log('-'.repeat(78));
  console.log(`Total: ${entries.length} files, ${totalWords} words, ${totalChars} characters`);
}

main();
