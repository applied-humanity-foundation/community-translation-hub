import type { Document } from '../types';

interface TranslationPaneOptions {
  document: Document | null;
  onTranslationChange: (content: string) => void;
}

export class TranslationPane {
  private container: HTMLElement;
  private document: Document | null;
  private onTranslationChange: (content: string) => void;
  private highlightQuery: string = '';

  constructor(options: TranslationPaneOptions) {
    this.document = options.document;
    this.onTranslationChange = options.onTranslationChange;
    this.container = document.createElement('div');
    this.container.className = 'translation-pane';
  }

  render(): HTMLElement {
    this.update();
    return this.container;
  }

  setDocument(doc: Document): void {
    this.document = doc;
    this.highlightQuery = '';
    this.update();
  }

  highlight(query: string): void {
    this.highlightQuery = query;
    this.update();
  }

  private update(): void {
    if (!this.document) {
      this.container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          <p>Select a document from the sidebar to begin translating</p>
        </div>`;
      return;
    }

    const sourceWords = this.countWords(this.document.sourceContent);
    const targetWords = this.countWords(this.document.translatedContent);

    this.container.innerHTML = `
      <div class="pane-column">
        <div class="pane-header">
          <span class="lang-label">Source (${this.document.sourceLang.toUpperCase()})</span>
          <span class="word-count">${sourceWords} words</span>
        </div>
        <div class="pane-body source">
          <pre>${this.highlightText(this.escapeHtml(this.document.sourceContent))}</pre>
        </div>
      </div>
      <div class="pane-column">
        <div class="pane-header">
          <span class="lang-label">Translation (${this.document.targetLang.toUpperCase()})</span>
          <span class="word-count">${targetWords} words</span>
        </div>
        <div class="pane-body target">
          <textarea class="editor-textarea" placeholder="Start translating...">${this.escapeHtml(this.document.translatedContent)}</textarea>
        </div>
      </div>`;

    const textarea = this.container.querySelector('.editor-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.addEventListener('input', () => {
        this.onTranslationChange(textarea.value);
      });
    }
  }

  private highlightText(text: string): string {
    if (!this.highlightQuery) return text;
    const escaped = this.highlightQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return text.replace(/[&<>"]/g, (c) => map[c] || c);
  }

  private countWords(text: string): number {
    if (!text) return 0;
    const cleaned = text.replace(/[#*_`\[\]()>-]/g, ' ');
    const cjk = (cleaned.match(/[一-鿿㐀-䶿]/g) || []).length;
    const latin = cleaned.split(/\s+/).filter(w => /[a-zA-Z]/.test(w)).length;
    return cjk + latin;
  }
}
