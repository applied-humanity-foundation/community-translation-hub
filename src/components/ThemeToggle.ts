import type { Theme } from '../types';

interface ThemeToggleOptions {
  currentTheme: Theme;
  onChange: (theme: Theme) => void;
}

export class ThemeToggle {
  private container: HTMLElement;
  private theme: Theme;
  private onChange: (theme: Theme) => void;

  constructor(options: ThemeToggleOptions) {
    this.theme = options.currentTheme;
    this.onChange = options.onChange;
    this.container = document.createElement('div');
    this.container.className = 'theme-toggle';
  }

  render(): HTMLElement {
    this.update();
    return this.container;
  }

  private update(): void {
    const icon = this.theme === 'dark'
      ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
      : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';

    this.container.innerHTML = `
      <button class="btn btn-ghost" title="Toggle theme">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon}</svg>
      </button>`;

    this.container.querySelector('button')?.addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      this.onChange(this.theme);
      this.update();
    });
  }
}
