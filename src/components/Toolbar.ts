interface ToolbarOptions {
  onSearch: () => void;
  onExport: () => void;
  onDashboard: () => void;
}

export class Toolbar {
  private container: HTMLElement;
  private options: ToolbarOptions;

  constructor(options: ToolbarOptions) {
    this.options = options;
    this.container = document.createElement('div');
    this.container.className = 'toolbar';
  }

  render(): HTMLElement {
    this.container.innerHTML = `
      <div class="toolbar-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span class="toolbar-title">Translation Hub</span>
      </div>
      <div class="toolbar-actions">
        <button class="btn btn-ghost" data-action="search" title="Search (Ctrl+F)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          Search
        </button>
        <button class="btn btn-ghost" data-action="dashboard" title="Progress Dashboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
            <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
          </svg>
          Dashboard
        </button>
        <button class="btn btn-primary" data-action="export" title="Export Translation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
      </div>`;

    this.container.querySelector('[data-action="search"]')?.addEventListener('click', this.options.onSearch);
    this.container.querySelector('[data-action="export"]')?.addEventListener('click', this.options.onExport);
    this.container.querySelector('[data-action="dashboard"]')?.addEventListener('click', this.options.onDashboard);

    return this.container;
  }
}
