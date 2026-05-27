interface SearchBarOptions {
  onSearch: (query: string) => void;
}

export class SearchBar {
  private container: HTMLElement;
  private visible: boolean = false;
  private onSearch: (query: string) => void;

  constructor(options: SearchBarOptions) {
    this.onSearch = options.onSearch;
    this.container = document.createElement('div');
    this.container.className = 'search-bar';
  }

  render(): HTMLElement {
    this.container.innerHTML = `
      <div class="search-bar-inner" style="display: none;">
        <div class="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" class="search-input" placeholder="Search in document..." />
          <kbd class="search-shortcut">Esc</kbd>
        </div>
        <button class="btn btn-ghost search-close" title="Close search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>`;

    const inner = this.container.querySelector('.search-bar-inner') as HTMLElement;
    const input = this.container.querySelector('.search-input') as HTMLInputElement;
    const closeBtn = this.container.querySelector('.search-close') as HTMLElement;

    input?.addEventListener('input', () => {
      this.onSearch(input.value);
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.hide();
    });

    closeBtn?.addEventListener('click', () => this.hide());

    return this.container;
  }

  toggle(): void {
    this.visible ? this.hide() : this.show();
  }

  private show(): void {
    this.visible = true;
    const inner = this.container.querySelector('.search-bar-inner') as HTMLElement;
    if (inner) inner.style.display = 'flex';
    const input = this.container.querySelector('.search-input') as HTMLInputElement;
    input?.focus();
  }

  private hide(): void {
    this.visible = false;
    const inner = this.container.querySelector('.search-bar-inner') as HTMLElement;
    if (inner) inner.style.display = 'none';
    const input = this.container.querySelector('.search-input') as HTMLInputElement;
    if (input) input.value = '';
    this.onSearch('');
  }
}
