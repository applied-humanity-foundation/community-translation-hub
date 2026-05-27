import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../content');
const SUPPORTED_LOCALES = ['en', 'zh'];

interface ValidationResult {
  document: string;
  missingIn: string[];
  sourceWordCount: number;
  translationWordCount: number;
  coverage: number;
}

function getDocumentSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
}

function countWords(text: string): number {
  const cleaned = text.replace(/[#*_`\[\]()>-]/g, ' ');
  const cjk = (cleaned.match(/[一-鿿㐀-䶿]/g) || []).length;
  const latin = cleaned.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)).length;
  return cjk + latin;
}

function validate(): ValidationResult[] {
  const allSlugs = new Set<string>();
  for (const locale of SUPPORTED_LOCALES) {
    for (const slug of getDocumentSlugs(locale)) {
      allSlugs.add(slug);
    }
  }

  const results: ValidationResult[] = [];

  for (const slug of allSlugs) {
    const missingIn: string[] = [];
    let sourceWordCount = 0;
    let translationWordCount = 0;

    for (const locale of SUPPORTED_LOCALES) {
      const filePath = path.join(CONTENT_DIR, locale, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        missingIn.push(locale);
      } else {
        const content = fs.readFileSync(filePath, 'utf-8');
        const wc = countWords(content);
        if (locale === 'en') {
          sourceWordCount = wc;
        } else {
          translationWordCount = wc;
        }
      }
    }

    const coverage = sourceWordCount > 0 ? Math.round((translationWordCount / sourceWordCount) * 100) : 0;

    results.push({ document: slug, missingIn, sourceWordCount, translationWordCount, coverage });
  }

  return results;
}

function main(): void {
  console.log('Validating translations...\n');

  const results = validate();
  let hasErrors = false;

  for (const result of results) {
    const status = result.missingIn.length > 0 ? 'MISSING' : result.coverage < 50 ? 'LOW' : 'OK';
    const icon = status === 'OK' ? '  ' : status === 'LOW' ? '  ' : '  ';

    console.log(`${icon} ${result.document}`);
    if (result.missingIn.length > 0) {
      console.log(`   Missing in: ${result.missingIn.join(', ')}`);
      hasErrors = true;
    }
    console.log(`   Source: ${result.sourceWordCount} words | Translation: ${result.translationWordCount} words | Coverage: ${result.coverage}%`);
  }

  console.log(`\nTotal documents: ${results.length}`);
  console.log(`Complete: ${results.filter((r) => r.missingIn.length === 0).length}`);
  console.log(`Missing translations: ${results.filter((r) => r.missingIn.length > 0).length}`);

  if (hasErrors) {
    process.exit(1);
  }
}

main();
