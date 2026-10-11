import { createClient } from '@sanity/client';
import { inheritMeta, withPaths } from './paths';
import { sampleAllProjects, sampleSettings } from './sample';
import type { BodyBlock, Project, ProjectCardData, Settings } from './types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const client = projectId
  ? createClient({ projectId, dataset, apiVersion: '2024-10-01', useCdn: false })
  : null;

const img = (url?: string) => (url ? `${url}?auto=format&w=2000` : '');

const CARD_PROJECTION = `
  "slug": slug.current,
  title, client, agency, year,
  "coverUrl": cover.asset->url,
  cardColor,
  "parentSlug": parent->slug.current
`;

const PROJECT_QUERY = `*[_type == "project"] | order(order asc, year desc){
  ${CARD_PROJECTION},
  "categories": categories[]->title,
  lede,
  body[]{
    ...,
    _type == "figure" => {
      ...,
      "url": image.asset->url
    },
    _type == "gallery" => {
      images[]{
        "url": asset->url,
        alt,
        caption
      }
    },
    _type == "cards" => {
      heading,
      "items": items[]->{ ${CARD_PROJECTION} }
    },
    _type == "imageBlock" => {
      _key, _type,
      "url": image.asset->url,
      alt, fullWidth
    },
    _type == "videoBlock" => { _key, _type, url, background },
    _type == "textBlock" => { _key, _type, text }
  }
}`;

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteTitle, description, firstName, lastName, role, heroIntro, beginLead, beginQuestion, aboutIntro,
  "portraitUrl": portrait.asset->url,
  sections[]{title, items[]{label, detail}},
  clientGroups[]{category, "logos": logos[]{ "url": asset->url, "name": coalesce(alt, "") }},
  awardGroups[]{title, awards[]{name, result}},
  email,
  socials[]{label, url}
}`;

function mapCard(c: any): Omit<ProjectCardData, 'path'> {
  return {
    slug: c.slug,
    title: c.title,
    client: c.client || '',
    agency: c.agency || undefined,
    year: c.year || undefined,
    coverUrl: img(c.coverUrl),
    cardColor: c.cardColor || undefined,
  };
}

function mapBody(body: any[] | undefined, pathBySlug: Map<string, string>): BodyBlock[] {
  return (body ?? []).map((b) => {
    if (b._type === 'figure') {
      return { ...b, url: img(b.url), layout: b.layout || 'wide' };
    }
    if (b._type === 'gallery') {
      return {
        ...b,
        images: (b.images ?? []).map((im: any) => ({ ...im, url: img(im.url) })),
      };
    }
    if (b._type === 'cards') {
      return {
        ...b,
        items: (b.items ?? [])
          .filter((it: any) => it?.slug)
          .map((it: any) => ({
            ...mapCard(it),
            path: pathBySlug.get(it.slug) || `/project/${it.slug}/`,
            parentSlug: it.parentSlug,
          })),
      };
    }
    if (b._type === 'imageBlock') {
      return {
        _key: b._key,
        _type: 'figure',
        url: img(b.url),
        alt: b.alt,
        layout: b.fullWidth === false ? 'content' : 'wide',
      };
    }
    if (b._type === 'videoBlock') {
      return { _key: b._key, _type: 'video', url: b.url };
    }
    if (b._type === 'textBlock' && b.text) {
      return {
        _key: b._key,
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [{ _key: `${b._key}-s`, _type: 'span', text: b.text, marks: [] }],
      };
    }
    return b;
  });
}

function normalize(raw: any[]): Project[] {
  const drafts = raw
    .filter((p) => p?.slug)
    .map((p) => ({
      ...mapCard(p),
      parentSlug: p.parentSlug || undefined,
      categories: p.categories ?? [],
      lede: p.lede || undefined,
      body: p.body ?? [],
    }));
  const withPath = withPaths(drafts);
  const pathBySlug = new Map(withPath.map((p) => [p.slug, p.path]));
  const mapped: Project[] = withPath.map((p) => ({
    ...p,
    coverUrl: p.coverUrl,
    body: mapBody(p.body as any[], pathBySlug),
  }));
  return inheritMeta(mapped);
}

export async function getAllProjects(): Promise<Project[]> {
  if (!client) return sampleAllProjects;
  const raw: any[] = await client.fetch(PROJECT_QUERY);
  return raw?.length ? normalize(raw) : sampleAllProjects;
}

export async function getProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => !p.parentSlug);
}

export async function getProject(slugPath: string[]) {
  const all = await getAllProjects();
  const path = `/project/${slugPath.join('/')}/`;
  const i = all.findIndex((p) => p.path === path);
  if (i < 0) return null;
  const project = all[i];
  const siblings = all.filter((p) => (p.parentSlug || '') === (project.parentSlug || ''));
  const si = siblings.findIndex((p) => p.slug === project.slug);
  const children = all.filter((p) => p.parentSlug === project.slug);
  return {
    project,
    all,
    children,
    prev: siblings[(si - 1 + siblings.length) % siblings.length],
    next: siblings[(si + 1) % siblings.length],
  };
}

export async function getSettings(): Promise<Settings> {
  if (!client) return sampleSettings;
  const s: any = await client.fetch(SETTINGS_QUERY);
  if (!s) return sampleSettings;
  return {
    ...sampleSettings,
    ...s,
    beginLead: s.beginLead || sampleSettings.beginLead,
    beginQuestion: s.beginQuestion || sampleSettings.beginQuestion,
    portraitUrl: img(s.portraitUrl),
    sections: s.sections ?? [],
    clientGroups: (s.clientGroups ?? []).map((g: any) => ({ ...g, logos: g.logos ?? [] })),
    awardGroups: (s.awardGroups ?? []).map((g: any) => ({ ...g, awards: g.awards ?? [] })),
    socials: s.socials ?? [],
  };
}
