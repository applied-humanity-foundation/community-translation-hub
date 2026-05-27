import type { Document, AppConfig, Locale } from '../types';

const STORAGE_KEYS = {
  DOCUMENTS: 'cth_documents',
  CONFIG: 'cth_config',
  LAST_ACTIVE: 'cth_last_active',
} as const;

const DEFAULT_CONFIG: AppConfig = {
  defaultSourceLang: 'en',
  defaultTargetLang: 'zh',
  theme: 'light',
  fontSize: 16,
  autoSaveInterval: 30000,
  showLineNumbers: true,
};

export class StorageUtil {
  static getDocuments(): Document[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static saveDocuments(documents: Document[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (err) {
      console.warn('Failed to save documents to localStorage:', err);
    }
  }

  static getConfig(): AppConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_CONFIG };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  static saveConfig(config: AppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (err) {
      console.warn('Failed to save config to localStorage:', err);
    }
  }

  static getLastActiveDocument(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
  }

  static setLastActiveDocument(id: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, id);
  }

  static exportData(): string {
    const data = {
      documents: this.getDocuments(),
      config: this.getConfig(),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.documents) this.saveDocuments(data.documents);
      if (data.config) this.saveConfig(data.config);
      return true;
    } catch {
      return false;
    }
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }

  static getStorageSize(): number {
    let total = 0;
    for (const key of Object.values(STORAGE_KEYS)) {
      const item = localStorage.getItem(key);
      if (item) total += item.length * 2;
    }
    return total;
  }
}
