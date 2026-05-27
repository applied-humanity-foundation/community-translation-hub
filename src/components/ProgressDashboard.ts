import type { Document } from '../types';

interface ProgressDashboardOptions {
  documents: Document[];
}

export class ProgressDashboard {
  private container: HTMLElement;
  private documents: Document[];
  private visible: boolean = false;

  constructor(options: ProgressDashboardOptions) {
    this.documents = options.documents;
    this.container = document.createElement('div');
    this.container.className = 'progress-dashboard-overlay';
  }

  render(): HTMLElement {
    this.update();
    return this.container;
  }

  toggle(): void {
    this.visible = !this.visible;
    this.update();
  }

  private update(): void {
    if (!this.visible) {
      this.container.style.display = 'none';
      return;
    }

    const totalWords = this.documents.reduce((sum, d) => sum + d.wordCount, 0);
    const translatedWords = this.documents.reduce((sum, d) => sum + d.translatedWordCount, 0);
    const overallProgress = totalWords > 0 ? Math.round((translatedWords / totalWords) * 100) : 0;

    const byStatus = {
      complete: this.documents.filter((d) => d.status === 'complete').length,
      in_progress: this.documents.filter((d) => d.status === 'in_progress').length,
      review: this.documents.filter((d) => d.status === 'review').length,
      draft: this.documents.filter((d) => d.status === 'draft').length,
    };

    this.container.style.display = 'flex';
    this.container.innerHTML = `
      <div class="dashboard-modal">
        <div class="dashboard-header">
          <h2>Translation Progress</h2>
          <button class="btn btn-ghost dashboard-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="dashboard-body">
          <div class="dashboard-summary">
            <div class="summary-card">
              <div class="summary-value">${overallProgress}%</div>
              <div class="summary-label">Overall Progress</div>
              <div class="summary-bar"><div class="summary-bar-fill" style="width:${overallProgress}%"></div></div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${totalWords.toLocaleString()}</div>
              <div class="summary-label">Total Source Words</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${translatedWords.toLocaleString()}</div>
              <div class="summary-label">Translated Words</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${this.documents.length}</div>
              <div class="summary-label">Documents</div>
            </div>
          </div>
          <div class="dashboard-status">
            <h3>Status Breakdown</h3>
            <div class="status-grid">
              <div class="status-item"><span class="badge badge-success">Complete</span><span>${byStatus.complete}</span></div>
              <div class="status-item"><span class="badge badge-info">Review</span><span>${byStatus.review}</span></div>
              <div class="status-item"><span class="badge badge-warning">In Progress</span><span>${byStatus.in_progress}</span></div>
              <div class="status-item"><span class="badge badge-neutral">Draft</span><span>${byStatus.draft}</span></div>
            </div>
          </div>
          <div class="dashboard-table">
            <h3>Per-Document Progress</h3>
            <table>
              <thead><tr><th>Document</th><th>Status</th><th>Words</th><th>Progress</th></tr></thead>
              <tbody>
                ${this.documents
                  .map((doc) => {
                    const pct = doc.wordCount > 0 ? Math.round((doc.translatedWordCount / doc.wordCount) * 100) : 0;
                    return `<tr>
                      <td>${doc.title}</td>
                      <td>${doc.status}</td>
                      <td>${doc.translatedWordCount}/${doc.wordCount}</td>
                      <td><div class="mini-bar"><div class="mini-bar-fill" style="width:${pct}%"></div></div></td>
                    </tr>`;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;

    this.container.querySelector('.dashboard-close')?.addEventListener('click', () => this.toggle());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.toggle();
    });
  }
}
