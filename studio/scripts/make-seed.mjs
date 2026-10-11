// Gera studio/seed.ndjson a partir dos dados de exemplo do site.
// Uso: node studio/scripts/make-seed.mjs   (Node 22.18+)
import { writeFileSync } from 'node:fs';
import { sampleAllProjects, sampleSettings } from '../../src/lib/sample.ts';

const k = (() => {
  let i = 0;
  return () => `k${(i++).toString(36)}`;
})();
const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

const cats = [...new Set(sampleAllProjects.flatMap((p) => p.categories))];
const docs = [];

cats.forEach((c) => docs.push({ _id: `category-${slugify(c)}`, _type: 'category', title: c }));

docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteTitle: sampleSettings.siteTitle,
  description: sampleSettings.description,
  firstName: sampleSettings.firstName,
  lastName: sampleSettings.lastName,
  role: sampleSettings.role,
  heroIntro: sampleSettings.heroIntro,
  beginLead: sampleSettings.beginLead,
  beginQuestion: sampleSettings.beginQuestion,
  aboutIntro: sampleSettings.aboutIntro,
  sections: sampleSettings.sections.map((s) => ({
    _key: k(),
    title: s.title,
    items: s.items.map((i) => ({ _key: k(), ...i })),
  })),
  awardGroups: sampleSettings.awardGroups.map((g) => ({
    _key: k(),
    title: g.title,
    awards: g.awards.map((a) => ({ _key: k(), ...a })),
  })),
  email: sampleSettings.email,
  socials: sampleSettings.socials.map((s) => ({ _key: k(), ...s })),
});

const toSeedBody = (body) =>
  body
    .map((b) => {
      if (b._type === 'block') {
        return {
          _key: k(),
          _type: 'block',
          style: b.style || 'normal',
          markDefs: [],
          children: (b.children || []).map((c) => ({
            _key: k(),
            _type: 'span',
            text: c.text,
            marks: c.marks || [],
          })),
        };
      }
      if (b._type === 'cards') return null;
      if (b._type === 'figure' || b._type === 'gallery' || b._type === 'video') return null;
      return { _key: k(), ...b };
    })
    .filter(Boolean);

sampleAllProjects.forEach((p, idx) =>
  docs.push({
    _id: `project-${p.slug}`,
    _type: 'project',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    client: p.client || undefined,
    agency: p.agency,
    year: p.year,
    order: idx + 1,
    cardColor: p.cardColor,
    lede: p.lede,
    parent: p.parentSlug
      ? { _type: 'reference', _ref: `project-${p.parentSlug}` }
      : undefined,
    categories: p.categories.map((c) => ({
      _key: k(),
      _type: 'reference',
      _ref: `category-${slugify(c)}`,
    })),
    body: toSeedBody(p.body),
  })
);

writeFileSync(new URL('../seed.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`seed.ndjson gerado com ${docs.length} documentos`);
