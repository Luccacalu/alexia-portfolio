import Link from 'next/link';
import type { ProjectCardData } from '@/lib/types';

export function ProjectCard({ p }: { p: ProjectCardData }) {
  return (
    <Link href={p.path} className="card">
      <div className="card-media">
        {p.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverUrl} alt="" loading="lazy" />
        ) : (
          <div className="placeholder">Capa</div>
        )}
        <div className="card-hover" aria-hidden="true">
          <span className="card-spark card-spark-one" />
          <span className="card-spark card-spark-two" />
          {p.client && (
            <>
              <span className="k">Cliente</span>
              <span className="v">{p.client}</span>
            </>
          )}
          <span className="t">{p.title}</span>
          {p.agency && (
            <>
              <span className="k">Agência</span>
              <span className="v">{p.agency}</span>
            </>
          )}
        </div>
      </div>
      {/* <div className="card-caption">{p.title}</div> */}
    </Link>
  );
}

export function ProjectGrid({
  projects,
  className = 'cards',
}: {
  projects: ProjectCardData[];
  className?: string;
}) {
  if (!projects.length) return null;
  return (
    <div className={className}>
      {projects.map((p) => (
        <ProjectCard key={p.path} p={p} />
      ))}
    </div>
  );
}
