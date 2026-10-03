import type { APIRoute, GetStaticPaths } from 'astro';
import { ENABLED_SECTIONS, getPublished, SECTION_LABEL } from '../../lib/content';
import { renderOgImage } from '../../lib/og';
import { SITE } from '../../consts';

// /og/<section>/<id>.png for every published post, plus /og/default.png for everything else.
export const getStaticPaths = (async () => {
  const posts = await Promise.all(
    ENABLED_SECTIONS.map(async (section) =>
      (await getPublished(section)).map((entry) => ({
        params: { slug: `${section}/${entry.id}` },
        props: {
          title: entry.data.title,
          kicker: `${SITE.handle} · ${SECTION_LABEL[section]}`,
          tags: entry.data.tags,
        },
      }))
    )
  );
  return [
    ...posts.flat(),
    {
      params: { slug: 'default' },
      props: { title: SITE.title, kicker: `Security researcher · ${SITE.handle}`, tags: [] },
    },
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as { title: string; kicker: string; tags: string[] });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
