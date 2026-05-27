import type { Locale } from '../types';

interface LanguageSwitchOptions {
  currentLang: Locale;
  onChange: (lang: Locale) => void;
}

export class LanguageSwitch {
  private container: HTMLElement;
  private lang: Locale;
  private onChange: (lang: Locale) => void;

  private labels: Record<Locale, string> = {
    en: 'EN',
    zh: 'ZH',
  };

  constructor(options: LanguageSwitchOptions) {
    this.lang = options.currentLang;
    this.onChange = options.onChange;
    this.container = document.createElement('div');
    this.container.className = 'language-switch';
  }

  render(): HTMLElement {
    this.update();
    return this.container;
  }

  private update(): void {
    this.container.innerHTML = `
      <div class="lang-switch-group">
        ${(Object.keys(this.labels) as Locale[])
          .map(
            (locale) => `
          <button class="lang-btn ${locale === this.lang ? 'active' : ''}" data-lang="${locale}">
            ${this.labels[locale]}
          </button>`
          )
          .join('')}
      </div>`;

    this.container.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = (btn as HTMLElement).dataset.lang as Locale;
        if (lang !== this.lang) {
          this.lang = lang;
          this.onChange(lang);
          this.update();
        }
      });
    });
  }
}
