# screamy7.com

Personal site: research, blog, notes and projects. Built with [Astro](https://astro.build), deployed on Cloudflare Pages.

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
- Security headers (CSP etc.): `public/_headers`
- `public/.well-known/security.txt`: bump `Expires` before it lapses (RFC 9116)

## Deploy (Cloudflare Pages)

1. Buy `screamy7.com` on Cloudflare Registrar (dash.cloudflare.com → Domain Registration).
2. Push this folder to a GitHub repo.
3. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22` (or newer)
4. *(Optional)* Email → Email Routing → forward an address like `hello@screamy7.com` to your inbox. If you switch to it, update `src/consts.ts` and `public/.well-known/security.txt`.
5. Check the first deploy on its `*.pages.dev` URL: `curl -sI https://<project>.pages.dev/about` should 308 to `/about/`, and `/about/` should return 200 with the headers from `public/_headers`.
6. Project → Custom domains → add `screamy7.com` (and `www.screamy7.com`, then redirect www → apex).
7. Every push to `main` deploys; other branches get preview URLs.

### After the domain is live

- **DNSSEC:** DNS → Settings → enable.
- **CAA:** add a CAA record restricting issuance to the CAs Cloudflare uses.
- **Analytics (optional):** Cloudflare Web Analytics. Update the CSP in `public/_headers` as noted there.
- **Old blog:** replace `ScreaMy7.github.io` with a redirect to `https://screamy7.com/`.

## TODO (style pass)

- Favicon (still a plain "S7" placeholder).
- Open Graph images for link previews on LinkedIn/X (currently text-only cards).
- HackerOne / X links in `src/consts.ts` (hidden until filled in).
