import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../content');

function markdownToSimpleHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hlo])(.+)$/gm, '<p>$1</p>');
}

function generatePdfHtml(documents: Array<{ title: string; locale: string; content: string }>): string {
  const pages = documents
    .map(
      (doc) => `
    <div class="page">
      <div class="page-header">
        <span class="locale-badge">${doc.locale.toUpperCase()}</span>
        <span class="page-title">${doc.title}</span>
      </div>
      <div class="page-content">
        ${markdownToSimpleHtml(doc.content)}
      </div>
    </div>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Community Translation Hub - Export</title>
  <style>
    body { font-family: 'Noto Sans', 'Noto Sans SC', sans-serif; margin: 0; padding: 20mm; color: #1e293b; line-height: 1.6; }
    .page { page-break-after: always; margin-bottom: 2rem; }
    .page:last-child { page-break-after: auto; }
    .page-header { border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
    .locale-badge { background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .page-title { font-size: 0.875rem; color: #64748b; }
    h1 { font-size: 1.5rem; color: #1e293b; margin: 1rem 0 0.5rem; }
    h2 { font-size: 1.25rem; color: #334155; margin: 1rem 0 0.5rem; }
    h3 { font-size: 1.1rem; color: #475569; margin: 0.75rem 0 0.5rem; }
    p { margin: 0.5rem 0; }
    li { margin: 0.25rem 0; margin-left: 1.5rem; }
    code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-size: 0.9em; }
    a { color: #2563eb; }
    .footer { text-align: center; color: #94a3b8; font-size: 0.75rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>Community Translation Hub</h1>
  <p class="footer">Applied Humanity Foundation | Generated ${new Date().toISOString().split('T')[0]}</p>
  ${pages}
</body>
</html>`;
}

function main(): void {
  const outputPath = path.resolve(__dirname, '../dist/export.html');
  const documents: Array<{ title: string; locale: string; content: string }> = [];

  const locales = ['en', 'zh'];
  for (const locale of locales) {
    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const title = file.replace('.md', '').split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      documents.push({ title, locale, content });
    }
  }

  const html = generatePdfHtml(documents);

  const distDir = path.dirname(outputPath);
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Export written to: ${outputPath}`);
  console.log(`Documents: ${documents.length}`);
  console.log('Open the HTML file in a browser and use Print > Save as PDF');
}

main();
