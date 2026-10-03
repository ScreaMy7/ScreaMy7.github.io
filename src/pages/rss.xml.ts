import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllItems, SECTION_LABEL } from '../lib/content';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
  const items = await getAllItems();
  return rss({
    title: `${SITE.title} (${SITE.handle})`,
    description: SITE.description,
    site: context.site!,
    items: items.map((item) => ({
      title: item.title,
      description: item.description,
      pubDate: item.date,
      link: item.href,
      categories: [SECTION_LABEL[item.section], ...item.tags],
    })),
  });
}
