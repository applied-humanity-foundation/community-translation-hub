# Translation Guide

This guide provides best practices for translating digital literacy content in the Community Translation Hub.

## Before You Start

1. Read the source document completely before translating
2. Check `GLOSSARY.md` for established translations of technical terms
3. Understand the target audience: people with little or no technical background

## Translation Principles

### Accuracy
- Convey the same meaning as the source text
- Don't add information not present in the original
- Don't omit information from the original
- If a concept doesn't translate directly, explain it in a way the target audience will understand

### Natural Language
- Write as a native speaker would naturally express the idea
- Avoid word-for-word translation that sounds awkward
- Use culturally appropriate examples and references
- Maintain the friendly, encouraging tone of the original

### Consistency
- Use the same translation for a technical term throughout a document
- Follow the glossary for established terms
- When introducing a new term, use it consistently from that point forward

### Accessibility
- Keep language simple and clear
- Short sentences are easier to understand
- Explain technical terms when first used
- Consider that readers may be using translation tools to verify your work

## Technical Terms

### When to Translate
- Common terms that have established translations (e.g., "file" → "文件")
- Concepts that are better understood in the local language

### When to Keep English
- Brand names: Google, Firefox, Windows, Chrome
- Technical terms with no established translation
- Acronyms commonly used in English form (e.g., Wi-Fi, USB, PDF)

### Mixed Approach
For terms where both forms are useful:
- First mention: "操作系统（Operating System）"
- Subsequent mentions: "操作系统"

## Markdown Formatting

- Preserve all Markdown syntax exactly as in the source
- Heading levels must match: `## Section` → `## 对应标题`
- Keep the same number of list items
- Don't translate text inside code blocks unless it's comments
- Preserve all links — translate link text but keep URLs unchanged

## Quality Checklist

Before submitting a translation:

- [ ] All content has been translated (no remaining English text except brand names)
- [ ] Markdown structure matches the source document
- [ ] Technical terms are consistent with GLOSSARY.md
- [ ] The translation reads naturally to a native speaker
- [ ] No information has been added or omitted
- [ ] Links are preserved and working
- [ ] The tone is friendly and encouraging

## Getting Help

- Check existing translations in the `content/` directory for reference
- Open an issue with the "translation" label for questions
- Reach out to other translators for review and feedback
