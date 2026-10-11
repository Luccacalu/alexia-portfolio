import { createClient } from '@sanity/client';
import type { Project, Settings } from './types';
import { sampleProjects, sampleSettings } from './sample';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const client = projectId
  ? createClient({ projectId, dataset, apiVersion: '2024-10-01', useCdn: false })
  : null;

const img = (url?: string) => (url ? `${url}?auto=format&w=2000` : '');

const PROJECT_QUERY = `*[_type == "project"] | order(order asc, year desc){
  "slug": slug.current,
  title, client, agency, year,
  "coverUrl": cover.asset->url,
  cardColor,
  "categories": categories[]->title,
  blocks[]{
    _key, _type, text, alt, fullWidth, background,
    "url": coalesce(image.asset->url, url)
  },
  stats[]{value, label},
  closing,
  crew[]{role, names}
}`;

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteTitle, description, firstName, lastName, role, heroIntro, aboutIntro,
  "portraitUrl": portrait.asset->url,
  sections[]{title, items[]{label, detail}},
  clientGroups[]{category, "logos": logos[]{ "url": asset->url, "name": coalesce(alt, "") }},
  awardGroups[]{title, awards[]{name, result}},
  email,
  socials[]{label, url}
}`;

export async function getProjects(): Promise<Project[]> {
  if (!client) return sampleProjects;
  const raw: any[] = await client.fetch(PROJECT_QUERY);
  if (!raw?.length) return sampleProjects;
  return raw.map((p) => ({
    ...p,
    coverUrl: img(p.coverUrl),
    categories: p.categories ?? [],
    stats: p.stats ?? [],
    crew: (p.crew ?? []).map((c: any) => ({ role: c.role, names: c.names ?? [] })),
    blocks: (p.blocks ?? []).map((b: any) =>
      b._type === 'imageBlock' ? { ...b, url: img(b.url) } : b
    ),
  }));
}

export async function getProject(slug: string) {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return {
    project: all[i],
    prev: all[(i - 1 + all.length) % all.length],
    next: all[(i + 1) % all.length],
  };
}

export async function getSettings(): Promise<Settings> {
  if (!client) return sampleSettings;
  const s: any = await client.fetch(SETTINGS_QUERY);
  if (!s) return sampleSettings;
  return {
    ...sampleSettings,
    ...s,
    portraitUrl: img(s.portraitUrl),
    sections: s.sections ?? [],
    clientGroups: (s.clientGroups ?? []).map((g: any) => ({ ...g, logos: g.logos ?? [] })),
    awardGroups: (s.awardGroups ?? []).map((g: any) => ({ ...g, awards: g.awards ?? [] })),
    socials: s.socials ?? [],
  };
}
