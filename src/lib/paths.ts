import type { Project } from './types';

type WithSlug = { slug: string; parentSlug?: string };

export function computePath(item: WithSlug, bySlug: Map<string, WithSlug>): string {
  const parts = [item.slug];
  const seen = new Set<string>([item.slug]);
  let current: WithSlug | undefined = item;
  while (current?.parentSlug) {
    if (seen.has(current.parentSlug)) break;
    seen.add(current.parentSlug);
    const parent = bySlug.get(current.parentSlug);
    if (!parent) break;
    parts.unshift(parent.slug);
    current = parent;
  }
  return `/project/${parts.join('/')}/`;
}

export function withPaths<T extends WithSlug>(items: T[]): (T & { path: string })[] {
  const bySlug = new Map(items.map((p) => [p.slug, p]));
  return items.map((p) => ({ ...p, path: computePath(p, bySlug) }));
}

export function inheritMeta(projects: Project[]): Project[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return projects.map((p) => {
    let client = p.client;
    let agency = p.agency;
    let year = p.year;
    let current = p;
    const seen = new Set<string>();
    while (current.parentSlug && seen.size < 12) {
      if (seen.has(current.parentSlug)) break;
      seen.add(current.parentSlug);
      const parent = bySlug.get(current.parentSlug);
      if (!parent) break;
      if (!client) client = parent.client;
      if (!agency) agency = parent.agency;
      if (!year) year = parent.year;
      current = parent;
    }
    return { ...p, client, agency, year };
  });
}

export function crumbsFor(project: Project, all: Project[]) {
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const chain: Project[] = [];
  let current: Project | undefined = project;
  const seen = new Set<string>();
  while (current && !seen.has(current.slug)) {
    seen.add(current.slug);
    chain.unshift(current);
    current = current.parentSlug ? bySlug.get(current.parentSlug) : undefined;
  }
  return chain;
}
