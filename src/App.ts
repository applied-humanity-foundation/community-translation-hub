import { DocumentList } from './components/DocumentList';
import { TranslationPane } from './components/TranslationPane';
import { Toolbar } from './components/Toolbar';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitch } from './components/LanguageSwitch';
import { StorageUtil } from './utils/storage';
import { initI18n, setLocale } from './utils/i18n';
import type { Document, AppConfig, Locale } from './types';

export class App {
  private root: HTMLElement;
  private documents: Document[] = [];
  private activeDocument: Document | null = null;
  private config: AppConfig;
  private autoSaveTimer: number | null = null;

  private toolbar!: Toolbar;
  private documentList!: DocumentList;
  private translationPane!: TranslationPane;
  private progressDashboard!: ProgressDashboard;
  private searchBar!: SearchBar;

  constructor(root: HTMLElement) {
    this.root = root;
    this.config = StorageUtil.getConfig();
  }

  async init(): Promise<void> {
    initI18n(this.config.defaultTargetLang);
    this.applyTheme(this.config.theme);
    await this.loadDocuments();
    this.render();
    this.bindEvents();
    this.startAutoSave();
  }

  private async loadDocuments(): Promise<void> {
    const saved = StorageUtil.getDocuments();
    if (saved.length > 0) {
      this.documents = saved;
      return;
    }

    const defaultDocs = [
      'getting-started-with-computers',
      'internet-safety-guide',
      'introduction-to-ai',
      'data-privacy-basics',
      'open-source-explained',
    ];

    for (const slug of defaultDocs) {
      try {
        const sourceResp = await fetch(`/content/en/${slug}.md`);
        const sourceContent = await sourceResp.text();

        let translatedContent = '';
        try {
          const targetResp = await fetch(`/content/zh/${slug}.md`);
          translatedContent = await targetResp.text();
        } catch {
          // Translation may not exist yet
        }

        this.documents.push({
          id: crypto.randomUUID(),
          slug,
          title: this.slugToTitle(slug),
          sourceLang: 'en',
          targetLang: 'zh',
          sourceContent,
          translatedContent,
          lastModified: new Date().toISOString(),
          status: translatedContent ? 'complete' : 'draft',
          wordCount: this.countWords(sourceContent),
          translatedWordCount: this.countWords(translatedContent),
        });
      } catch (err) {
        console.warn(`Failed to load document: ${slug}`, err);
      }
    }

    StorageUtil.saveDocuments(this.documents);
  }

  private render(): void {
    this.root.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'app-header';

    this.toolbar = new Toolbar({
      onSearch: () => this.searchBar.toggle(),
      onExport: () => this.exportCurrent(),
      onDashboard: () => this.progressDashboard.toggle(),
    });
    header.appendChild(this.toolbar.render());

    const controls = document.createElement('div');
    controls.className = 'header-controls';

    const langSwitch = new LanguageSwitch({
      currentLang: this.config.defaultTargetLang,
      onChange: (lang: Locale) => this.switchLanguage(lang),
    });
    controls.appendChild(langSwitch.render());

    const themeToggle = new ThemeToggle({
      currentTheme: this.config.theme,
      onChange: (theme) => {
        this.config.theme = theme;
        this.applyTheme(theme);
        StorageUtil.saveConfig(this.config);
      },
    });
    controls.appendChild(themeToggle.render());
    header.appendChild(controls);

    const main = document.createElement('main');
    main.className = 'app-main';

    this.documentList = new DocumentList({
      documents: this.documents,
      activeId: this.activeDocument?.id ?? null,
      onSelect: (doc) => this.selectDocument(doc),
    });

    this.translationPane = new TranslationPane({
      document: this.activeDocument,
      onTranslationChange: (content) => this.updateTranslation(content),
    });

    this.searchBar = new SearchBar({
      onSearch: (query) => this.performSearch(query),
    });

    this.progressDashboard = new ProgressDashboard({
      documents: this.documents,
    });

    const sidebar = document.createElement('aside');
    sidebar.className = 'app-sidebar';
    sidebar.appendChild(this.documentList.render());

    const content = document.createElement('section');
    content.className = 'app-content';
    content.appendChild(this.searchBar.render());
    content.appendChild(this.translationPane.render());

    main.appendChild(sidebar);
    main.appendChild(content);

    this.root.appendChild(header);
    this.root.appendChild(main);
    this.root.appendChild(this.progressDashboard.render());

    if (this.documents.length > 0 && !this.activeDocument) {
      this.selectDocument(this.documents[0]);
    }
  }

  private selectDocument(doc: Document): void {
    this.activeDocument = doc;
    this.translationPane.setDocument(doc);
    this.documentList.setActive(doc.id);
  }

  private updateTranslation(content: string): void {
    if (!this.activeDocument) return;
    this.activeDocument.translatedContent = content;
    this.activeDocument.translatedWordCount = this.countWords(content);
    this.activeDocument.lastModified = new Date().toISOString();
    this.activeDocument.status = 'in_progress';
  }

  private performSearch(query: string): void {
    if (!this.activeDocument || !query) return;
    this.translationPane.highlight(query);
  }

  private exportCurrent(): void {
    if (!this.activeDocument) return;
    const blob = new Blob([this.activeDocument.translatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.activeDocument.slug}-${this.activeDocument.targetLang}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private switchLanguage(lang: Locale): void {
    this.config.defaultTargetLang = lang;
    setLocale(lang);
    StorageUtil.saveConfig(this.config);
    this.render();
  }

  private applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private startAutoSave(): void {
    if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
    this.autoSaveTimer = window.setInterval(() => {
      StorageUtil.saveDocuments(this.documents);
    }, this.config.autoSaveInterval);
  }

  private bindEvents(): void {
    window.addEventListener('beforeunload', () => {
      StorageUtil.saveDocuments(this.documents);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        StorageUtil.saveDocuments(this.documents);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        this.searchBar.toggle();
      }
    });
  }

  private slugToTitle(slug: string): string {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  private countWords(text: string): number {
    if (!text) return 0;
    const cleaned = text.replace(/[#*_`\[\]()>-]/g, ' ');
    const cjk = (cleaned.match(/[一-鿿㐀-䶿]/g) || []).length;
    const latin = cleaned.split(/\s+/).filter(w => /[a-zA-Z]/.test(w)).length;
    return cjk + latin;
  }
}
