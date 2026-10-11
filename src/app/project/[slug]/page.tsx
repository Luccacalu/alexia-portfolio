import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Blocks } from '@/components/Media';
import { getProject, getProjects } from '@/lib/sanity';

export async function generateStaticParams() {
  const all = await getProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProject(params.slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: project.title,
    description: `${project.client}${project.agency ? ' · ' + project.agency : ''}`,
    openGraph: project.coverUrl ? { images: [project.coverUrl] } : undefined,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const data = await getProject(params.slug);
  if (!data) notFound();
  const { project: p, prev, next } = data;

  return (
    <main className="page">
      <div className="p-head">
        <div>
          <div className="eyebrow label">Cliente</div>
          <div className="val">{p.client}</div>
        </div>
        <h1 className="display">{p.title}</h1>
        <div className="right">
          {p.agency && (
            <>
              <div className="eyebrow label">Agência</div>
              <div className="val">{p.agency}</div>
            </>
          )}
          {p.year && <div className="eyebrow" style={{ marginTop: 12 }}>{p.year}</div>}
        </div>
      </div>

      <Blocks blocks={p.blocks} />

      {p.stats.length > 0 && (
        <div className="stats">
          {p.stats.map((s, i) => (
            <div key={i}>
              <strong>{s.value}</strong>
              <span className="eyebrow">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {p.closing && <p className="display closing">{p.closing}</p>}

      {p.crew.length > 0 && (
        <section>
          <h2 className="display crew-title">Ficha técnica</h2>
          <div className="crew">
            {p.crew.map((c, i) => (
              <div key={i}>
                <h4>{c.role}</h4>
                {c.names.map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {p.categories.length > 0 && (
        <div className="tags">
          {p.categories.map((c) => (
            <Link key={c} href={`/categories/?tag=${encodeURIComponent(c)}`}>{c}</Link>
          ))}
        </div>
      )}

      <div className="pn">
        <Link href={`/project/${prev.slug}/`}><small>ANTERIOR</small>{prev.title}</Link>
        <Link href={`/project/${next.slug}/`} style={{ textAlign: 'right' }}><small>PRÓXIMO</small>{next.title}</Link>
      </div>
    </main>
  );
}
