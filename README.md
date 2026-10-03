# screamy7.com

Personal site: research, blog, notes and projects. Built with [Astro](https://astro.build), deployed on GitHub Pages.

## Run locally

```sh
npm install
npm run dev       # http://localhost:4321 (next free port if taken); drafts are visible here
npm run build     # production build into dist/ (drafts excluded)
npm run preview   # serve dist/ locally
```

## Writing

| Section | Folder | URL |
|---|---|---|
| Research (advisories, writeups) | `src/content/research/` | `/research/<filename>/` |
| Blog (long posts) | `src/content/blog/` | `/blog/<filename>/` |
| Notes (snippets, TILs) | `src/content/notes/` | `/notes/<filename>/` |

1. Copy the section's `_TEMPLATE.md` to a new file without the leading underscore, e.g. `src/content/blog/frida-tips.md`.
2. Fill in the frontmatter. Keep `draft: true` while writing; it shows in `npm run dev` only.
3. Set `draft: false` and push to publish.

Files starting with `_` are never published.

### Cover images

Every blog post gets a unique generated cover (network / hex dump / radar / waves pattern, colours
seeded from the title, first tag printed on it). To use your own image instead, put it next to the
post and reference it in the frontmatter:

```yaml
cover: ./images/my-post.png
coverAlt: "What the image shows"
```

Own images are resized and converted to WebP automatically at build time. Use 1200×630 or wider.

### Interactive bits (where they live)

| Feature | Code |
|---|---|
| Home hero particle network | `public/js/hero.js` |
| Card spotlight + 3D tilt, scroll reveal, reading progress, TOC highlight, copy buttons, theme toggle | `public/js/site.js` |
| Page transitions (cover morphs from card into post) | CSS View Transitions in `src/styles/global.css` (no JS; Chrome/Edge/Safari; other browsers navigate normally) |
| Generated covers | `src/lib/cover.ts`, `src/components/GeneratedCover.astro` |

All motion is switched off for visitors with "reduce motion" enabled in their OS.

Research posts: only publish when the issue is fixed **and** the program/vendor allows disclosure.

**Research and Notes are currently hidden** (only Blog is live). To bring them back:

1. Rename `src/pages/_research` → `src/pages/research` and `src/pages/_notes` → `src/pages/notes`.
2. Add them to `ENABLED_SECTIONS` in `src/lib/content.ts`.
3. Add them back to `NAV` in `src/consts.ts`.

## Editing other things

- Name, email, social links: `src/consts.ts`
- Projects and contributions: `src/data/projects.ts`
- About page: `src/pages/about.astro`
- Colours and fonts: the tokens at the top of `src/styles/global.css`
- `public/.well-known/security.txt`: bump `Expires` before it lapses (RFC 9116)

## Deploy (GitHub Pages)

Every push to `main` on the `ScreaMy7/ScreaMy7.github.io` repo runs `.github/workflows/deploy.yml`, which builds with Node 22 and publishes to https://screamy7.github.io. Check runs with `gh run list -R ScreaMy7/ScreaMy7.github.io`.

GitHub Pages serves pages with `Cache-Control: max-age=600`, so a browser that already had the site open can show the old version for up to 10 minutes. Hard-refresh to check a deploy.

## TODO (style pass)

- Favicon (still a plain "S7" placeholder).
- Open Graph images for link previews on LinkedIn/X (currently text-only cards).
- HackerOne / X links in `src/consts.ts` (hidden until filled in).
