import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files starting with "_" (e.g. _TEMPLATE.md) are ignored, so templates never get published.
const pattern = '**/[^_]*.{md,mdx}';

const base = {
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  // Drafts are visible in `npm run dev` but excluded from the production build.
  draft: z.boolean().default(false),
};

const blog = defineCollection({
  loader: glob({ pattern, base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      ...base,
      description: z.string(),
      // Optional own cover image, relative to the post file (e.g. ./images/cover.png).
      // Without one, a unique cover is generated from the title and tags.
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

// Advisories and vulnerability writeups. Only publish what you are allowed to disclose.
const research = defineCollection({
  loader: glob({ pattern, base: './src/content/research' }),
  schema: z.object({
    ...base,
    description: z.string(),
    vendor: z.string(),
    product: z.string(),
    affected: z.string().optional(),
    fixed: z.string().optional(),
    cve: z.array(z.string()).default([]),
    severity: z.enum(['critical', 'high', 'medium', 'low', 'info']).optional(),
    status: z.enum(['fixed', 'disclosed', 'wontfix']).default('fixed'),
  }),
});

// Short-form: snippets, one-liners, TILs.
const notes = defineCollection({
  loader: glob({ pattern, base: './src/content/notes' }),
  schema: z.object(base),
});

export const collections = { blog, research, notes };
