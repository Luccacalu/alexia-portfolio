import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableBody } from '@/components/PortableBody';
import { ProjectVideos } from '@/components/ProjectVideos';
import { ProjectGrid } from '@/components/ProjectCard';
import { crumbsFor } from '@/lib/paths';
import { getAllProjects, getProject } from '@/lib/sanity';

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({
    slug: p.path.replace(/^\/project\//, '').replace(/\/$/, '').split('/'),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const data = await getProject(params.slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: project.title,
    description: project.lede || `${project.client}${project.agency ? ' · ' + project.agency : ''}`,
    openGraph: project.coverUrl ? { images: [project.coverUrl] } : undefined,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string[] } }) {
  const data = await getProject(params.slug);
  if (!data) notFound();
  const { project: p, all, children, prev, next } = data;
  const crumbs = crumbsFor(p, all);
  const meta = [p.client, p.agency, p.year].filter(Boolean);
  const hasInlineCards = p.body.some((b) => b._type === 'cards');
  const extraChildren = hasInlineCards
    ? children.filter((c) => !p.body.some((b) => b._type === 'cards' && b.items.some((i) => i.slug === c.slug)))
    : children;

  return (
    <main className="article">
      <nav className="crumbs" aria-label="Navegação">
        <Link href="/projects/">Trabalhos</Link>
        {crumbs.slice(0, -1).map((c) => (
          <span key={c.path}>
            <span className="sep" aria-hidden="true">
              /
            </span>
            <Link href={c.path}>{c.title}</Link>
          </span>
        ))}
      </nav>

      {meta.length > 0 && <p className="article-meta">{meta.join('  ·  ')}</p>}

      <h1 className="display article-title">{p.title}</h1>
      {p.lede && <p className="article-lede">{p.lede}</p>}

      <PortableBody value={p.body} />

      <ProjectVideos videos={p.videos || []} storageScope={p.path} />

      {extraChildren.length > 0 && (
        <section className="article-children">
          <h2 className="display">Continue</h2>
          <ProjectGrid projects={extraChildren} />
        </section>
      )}

      {p.categories.length > 0 && (
        <div className="tags">
          {p.categories.map((c) => (
            <Link key={c} href={`/categories/?tag=${encodeURIComponent(c)}`}>
              {c}
            </Link>
          ))}
        </div>
      )}

      {prev.slug !== p.slug && (
        <div className="pn">
          <Link href={prev.path}>
            <small>ANTERIOR</small>
            {prev.title}
          </Link>
          <Link href={next.path} className="pn-next">
            <small>PRÓXIMO</small>
            {next.title}
          </Link>
        </div>
      )}
    </main>
  );
}
