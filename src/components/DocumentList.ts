import type { Document } from '../types';

interface DocumentListOptions {
  documents: Document[];
  activeId: string | null;
  onSelect: (doc: Document) => void;
}

export class DocumentList {
  private container: HTMLElement;
  private documents: Document[];
  private activeId: string | null;
  private onSelect: (doc: Document) => void;
  private filterText: string = '';

  constructor(options: DocumentListOptions) {
    this.documents = options.documents;
    this.activeId = options.activeId;
    this.onSelect = options.onSelect;
    this.container = document.createElement('div');
    this.container.className = 'sidebar-content';
  }

  render(): HTMLElement {
    this.update();
    return this.container;
  }

  setActive(id: string): void {
    this.activeId = id;
    this.update();
  }

  private update(): void {
    const filtered = this.documents.filter(
      (doc) => !this.filterText || doc.title.toLowerCase().includes(this.filterText.toLowerCase())
    );

    this.container.innerHTML = `
      <div class="sidebar-header">
        <h2>Documents</h2>
        <input type="text" class="sidebar-search" placeholder="Filter documents..." value="${this.filterText}" />
      </div>
      <div class="document-list">
        ${filtered.map((doc) => this.renderDocItem(doc)).join('')}
      </div>
      <div class="sidebar-footer">${this.documents.length} documents</div>`;

    const searchInput = this.container.querySelector('.sidebar-search') as HTMLInputElement;
    searchInput?.addEventListener('input', () => {
      this.filterText = searchInput.value;
      this.update();
    });

    this.container.querySelectorAll('.document-item').forEach((el) => {
      el.addEventListener('click', () => {
        const id = (el as HTMLElement).dataset.id;
        const doc = this.documents.find((d) => d.id === id);
        if (doc) this.onSelect(doc);
      });
    });
  }

  private renderDocItem(doc: Document): string {
    const isActive = doc.id === this.activeId;
    const progress = doc.wordCount > 0 ? Math.round((doc.translatedWordCount / doc.wordCount) * 100) : 0;

    const statusBadge = {
      draft: '<span class="badge badge-neutral">Draft</span>',
      in_progress: '<span class="badge badge-warning">In Progress</span>',
      review: '<span class="badge badge-info">Review</span>',
      complete: '<span class="badge badge-success">Complete</span>',
    }[doc.status];

    return `
      <div class="document-item ${isActive ? 'active' : ''}" data-id="${doc.id}">
        <div class="doc-title">${doc.title}</div>
        <div class="doc-meta">
          ${statusBadge}
          <span>${progress}%</span>
        </div>
        <div class="doc-progress">
          <div class="doc-progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>`;
  }
}
