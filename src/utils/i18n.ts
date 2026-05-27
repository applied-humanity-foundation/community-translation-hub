import type { Locale } from '../types';

type TranslationStrings = Record<string, string>;

const translations: Record<Locale, TranslationStrings> = {
  en: {
    'app.title': 'Community Translation Hub',
    'app.subtitle': 'Collaborative translation for digital literacy education',
    'sidebar.documents': 'Documents',
    'sidebar.filter': 'Filter documents...',
    'toolbar.search': 'Search',
    'toolbar.export': 'Export',
    'toolbar.dashboard': 'Dashboard',
    'editor.source': 'Source',
    'editor.translation': 'Translation',
    'editor.placeholder': 'Start translating...',
    'editor.words': 'words',
    'status.draft': 'Draft',
    'status.in_progress': 'In Progress',
    'status.review': 'Under Review',
    'status.complete': 'Complete',
    'dashboard.title': 'Translation Progress',
    'dashboard.overall': 'Overall Progress',
    'dashboard.total_words': 'Total Source Words',
    'dashboard.translated_words': 'Translated Words',
    'dashboard.documents': 'Documents',
    'dashboard.status_breakdown': 'Status Breakdown',
    'dashboard.per_document': 'Per-Document Progress',
    'search.placeholder': 'Search in document...',
    'theme.toggle': 'Toggle theme',
    'lang.switch': 'Switch language',
    'export.download': 'Download translation',
    'progress.percent': '{0}%',
  },
  zh: {
    'app.title': '社区翻译协作平台',
    'app.subtitle': '面向数字素养教育的协作翻译工具',
    'sidebar.documents': '文档列表',
    'sidebar.filter': '筛选文档...',
    'toolbar.search': '搜索',
    'toolbar.export': '导出',
    'toolbar.dashboard': '仪表盘',
    'editor.source': '原文',
    'editor.translation': '译文',
    'editor.placeholder': '开始翻译...',
    'editor.words': '字',
    'status.draft': '草稿',
    'status.in_progress': '翻译中',
    'status.review': '审校中',
    'status.complete': '已完成',
    'dashboard.title': '翻译进度',
    'dashboard.overall': '整体进度',
    'dashboard.total_words': '原文总字数',
    'dashboard.translated_words': '已翻译字数',
    'dashboard.documents': '文档数量',
    'dashboard.status_breakdown': '状态统计',
    'dashboard.per_document': '各文档进度',
    'search.placeholder': '在文档中搜索...',
    'theme.toggle': '切换主题',
    'lang.switch': '切换语言',
    'export.download': '下载译文',
    'progress.percent': '{0}%',
  },
};

let currentLocale: Locale = 'en';

export function initI18n(locale: Locale): void {
  currentLocale = locale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string, ...args: (string | number)[]): string {
  const str = translations[currentLocale]?.[key] ?? translations.en[key] ?? key;
  return args.reduce<string>((result, arg, i) => result.replace(`{${i}}`, String(arg)), str);
}

export function getAvailableLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}
