// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://screamy7.com',
  // URLs are /blog/post/ (folder + index.html). Cloudflare Pages serves these with the slash
  // and redirects /blog/post → /blog/post/, so links, canonicals and the sitemap all agree.
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Dual themes: colors switch with the site's light/dark mode (see global.css).
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
