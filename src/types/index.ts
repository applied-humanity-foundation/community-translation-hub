export interface Document {
  id: string;
  slug: string;
  title: string;
  sourceLang: Locale;
  targetLang: Locale;
  sourceContent: string;
  translatedContent: string;
  lastModified: string;
  status: TranslationStatus;
  wordCount: number;
  translatedWordCount: number;
}

export interface Segment {
  id: number;
  source: string;
  translation: string;
  status: SegmentStatus;
  notes?: string;
}

export interface TranslationProgress {
  documentId: string;
  totalSegments: number;
  translatedSegments: number;
  reviewedSegments: number;
  percentage: number;
}

export interface GlossaryEntry {
  term: string;
  translations: Record<Locale, string>;
  definition: string;
  context?: string;
}

export interface SearchResult {
  documentId: string;
  segmentId: number;
  matchType: 'source' | 'translation';
  snippet: string;
  position: number;
}

export interface AppConfig {
  defaultSourceLang: Locale;
  defaultTargetLang: Locale;
  theme: Theme;
  fontSize: number;
  autoSaveInterval: number;
  showLineNumbers: boolean;
}

export type Locale = 'en' | 'zh';
export type Theme = 'light' | 'dark' | 'system';
export type TranslationStatus = 'draft' | 'in_progress' | 'review' | 'complete';
export type SegmentStatus = 'untranslated' | 'translated' | 'reviewed' | 'approved';

export interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

export interface WordCountResult {
  document: string;
  sourceWords: number;
  translatedWords: number;
  coverage: number;
}
