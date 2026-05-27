import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Custom Vite plugin that transforms .md files into importable modules.
 * Each markdown file is exported as a raw string so components can
 * parse and render it at runtime.
 */
function markdownPlugin() {
  return {
    name: 'vite-plugin-markdown',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;

      const content = readFileSync(id, 'utf-8');
      return {
        code: `export default ${JSON.stringify(content)};`,
        map: null,
      };
    },
  };
}

export default defineConfig({
  root: 'src',
  publicDir: resolve(__dirname, 'content'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
    },
  },
  plugins: [markdownPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@content': resolve(__dirname, 'content'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
