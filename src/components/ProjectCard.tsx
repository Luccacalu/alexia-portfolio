import Link from 'next/link';
import type { ProjectCardData } from '@/lib/types';

const DEFAULT_COLOR = '#b8ff00';

function textOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#0e0e0e';
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#0e0e0e' : '#ffffff';
}

export function ProjectCard({ p }: { p: ProjectCardData }) {
  const bg = p.cardColor || DEFAULT_COLOR;
  return (
    <Link href={p.path} className="card">
      <div className="card-media">
        {p.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverUrl} alt="" loading="lazy" />
        ) : (
          <div className="placeholder">Capa</div>
        )}
        <div className="card-hover" style={{ background: bg, color: textOn(bg) }} aria-hidden="true">
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
          <span className="d" />
          <span className="corner">
            <i>+</i>
          </span>
        </div>
      </div>
      <div className="card-caption">{p.title}</div>
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
