// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync } from 'node:fs';

// The Notes page is noindex while it's empty; keep it out of the sitemap until then too.
const hasNotes = readdirSync('./src/content/notes').some((f) => /^[^_].*\.mdx?$/.test(f));

// https://astro.build/config
export default defineConfig({
  site: 'https://screamy7.github.io',
  // URLs are /blog/post/ (folder + index.html). GitHub Pages serves these from the folder's
  // index.html, so links, canonicals and the sitemap all agree on the trailing slash.
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => hasNotes || !page.endsWith('/notes/') })],
  markdown: {
    shikiConfig: {
      // Dual themes: colors switch with the site's light/dark mode (see global.css).
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
