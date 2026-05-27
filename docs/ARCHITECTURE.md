# Architecture

## Overview

Community Translation Hub is a browser-based collaborative translation tool built with TypeScript and Vite. It provides a side-by-side editing interface for translating educational content between English and Chinese.

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Toolbar   │  │ SearchBar    │  │ Controls  │ │
│  └──────────┘  └──────────────┘  └───────────┘ │
│  ┌──────────┐  ┌──────────────────────────────┐ │
│  │ Document │  │     TranslationPane          │ │
│  │ List     │  │  ┌──────────┐ ┌───────────┐  │ │
│  │ (sidebar)│  │  │  Source   │ │Translation│  │ │
│  │          │  │  │  (read)   │ │ (edit)    │  │ │
│  │          │  │  └──────────┘ └───────────┘  │ │
│  └──────────┘  └──────────────────────────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │          ProgressDashboard (modal)        │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────┐  ┌──────────────────┐      │
│  │   localStorage   │  │  Content (MD)    │      │
│  │   (persistence)  │  │  (fetch on load) │      │
│  └─────────────────┘  └──────────────────┘      │
└─────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── main.ts              Entry point
├── App.ts               Main application class
├── components/          UI components
│   ├── TranslationPane  Side-by-side editor
│   ├── DocumentList     Sidebar document list
│   ├── Toolbar          Top toolbar
│   ├── SearchBar        Document search
│   ├── ProgressDashboard Progress modal
│   ├── ThemeToggle      Dark/light mode
│   └── LanguageSwitch   EN/ZH toggle
├── utils/               Utilities
│   ├── markdown.ts      Markdown parser
│   ├── diff.ts          Text diff engine
│   ├── storage.ts       localStorage wrapper
│   └── i18n.ts          Internationalization
├── types/               TypeScript definitions
│   └── index.ts
└── styles/              CSS
    ├── global.css       Variables, reset, layout
    ├── editor.css       Translation pane styles
    ├── sidebar.css      Sidebar styles
    └── responsive.css   Media queries
```

## Key Design Decisions

1. **Vanilla TypeScript**: No framework dependency — keeps the bundle small and the code accessible to contributors learning web development.

2. **Markdown-based content**: All educational content is stored as Markdown files, making it easy for non-technical contributors to write and edit.

3. **localStorage persistence**: User progress and preferences are stored in the browser. No server required for basic usage.

4. **Component pattern**: Each UI element is a class with `render()` and `update()` methods, similar to Web Components but simpler.

5. **Bilingual by default**: The entire UI supports both English and Chinese, practicing what we teach about multilingual accessibility.

## Data Flow

1. On load, `App.init()` reads config from localStorage and fetches markdown content
2. Documents are parsed and stored as `Document` objects
3. User selects a document → `TranslationPane` shows source and editable translation
4. Changes trigger auto-save to localStorage at configurable intervals
5. Export generates a downloadable markdown file
