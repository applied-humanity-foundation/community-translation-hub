# Adding New Languages

This guide explains how to add support for a new language to the Community Translation Hub.

## Step 1: Create Content Directory

Create a new directory under `content/` with the language's ISO 639-1 code:

```bash
mkdir content/fr    # French
mkdir content/es    # Spanish
mkdir content/ar    # Arabic
```

## Step 2: Translate Content Files

Copy the English source files and translate them:

```bash
cp content/en/*.md content/fr/
```

Then translate each file, keeping the same filename and Markdown structure. The filenames must match exactly — this is how the app pairs source documents with translations.

## Step 3: Add UI Translations

Edit `src/utils/i18n.ts` to add your language's UI strings:

```typescript
const translations: Record<Locale, TranslationStrings> = {
  en: { /* existing */ },
  zh: { /* existing */ },
  fr: {
    'app.title': 'Hub de Traduction Communautaire',
    'sidebar.documents': 'Documents',
    // ... add all keys
  },
};
```

## Step 4: Update Types

Add the new locale to the `Locale` type in `src/types/index.ts`:

```typescript
export type Locale = 'en' | 'zh' | 'fr';
```

## Step 5: Update Language Switch

Add the new language option in `src/components/LanguageSwitch.ts`:

```typescript
private labels: Record<Locale, string> = {
  en: 'EN',
  zh: 'ZH',
  fr: 'FR',
};
```

## Step 6: Validate

Run the validation script to ensure completeness:

```bash
npx ts-node scripts/validate-translations.ts
```

## Translation Guidelines

- Maintain the same Markdown structure (headings, lists, code blocks)
- Keep technical terms consistent — refer to `GLOSSARY.md`
- Preserve all links and references
- Adapt cultural references when appropriate
- Test the content in the translation interface before submitting

## Right-to-Left (RTL) Languages

For RTL languages (Arabic, Hebrew, etc.), additional CSS changes may be needed:

1. Add `dir="rtl"` attribute handling in `App.ts`
2. Mirror layout styles in `responsive.css`
3. Test thoroughly in the side-by-side view

## Submitting Your Translation

1. Fork the repository
2. Create a branch: `git checkout -b add-language-fr`
3. Add all translated files
4. Run validation: `npx ts-node scripts/validate-translations.ts`
5. Submit a Pull Request with the translation request template
