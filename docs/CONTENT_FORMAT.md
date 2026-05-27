# Content Format Guide

## File Format

All content files are standard Markdown (`.md`) files stored in locale-specific directories:

```
content/
├── en/
│   ├── getting-started-with-computers.md
│   └── internet-safety-guide.md
└── zh/
    ├── getting-started-with-computers.md
    └── internet-safety-guide.md
```

## Naming Convention

- Use lowercase kebab-case for filenames: `my-document-title.md`
- Filenames must match across all locale directories
- The filename is used to generate the display title (hyphens become spaces, words are capitalized)

## Document Structure

Every document should follow this structure:

```markdown
# Document Title

## Section Heading

Paragraph text explaining the concept clearly and simply.

### Subsection (if needed)

- Bullet points for lists of items
- Keep points concise and actionable

1. Numbered lists for sequential steps
2. Each step should be clear on its own

> Blockquotes for important callouts or tips

`inline code` for technical terms

​```
code blocks for longer examples
​```
```

## Writing Guidelines

### Audience

Our content is written for people with little to no technical background. Write as if explaining to a curious friend who has never used a computer.

### Tone

- Friendly and encouraging
- Patient — never condescending
- Practical — focus on what people can do, not abstract theory
- Inclusive — avoid jargon, explain technical terms when first used

### Structure

- Start each document with a brief introduction explaining why the topic matters
- Use headings to break content into scannable sections
- Keep paragraphs short (3-5 sentences maximum)
- Use bullet points and numbered lists generously
- End with actionable next steps or a summary

### Accessibility

- Use descriptive link text (not "click here")
- Provide alt text context when referencing images
- Avoid color-only indicators
- Use simple sentence structures

### Technical Terms

- Bold technical terms on first use: **operating system**
- Provide a brief definition in parentheses or the following sentence
- Add new terms to `GLOSSARY.md`
- Be consistent — use the same term throughout a document

## Translation Notes

When translating, keep in mind:

- Maintain the same Markdown structure exactly
- Adapt examples to the target culture when appropriate
- Don't translate brand names (Google, Firefox, Windows)
- Technical terms should use the established translation from `GLOSSARY.md`
- If no established translation exists, keep the English term with a Chinese explanation
