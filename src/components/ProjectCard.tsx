import Link from 'next/link';
import type { Project } from '@/lib/types';

const DEFAULT_COLOR = '#b8ff00';

// Escolhe texto escuro ou claro conforme a cor de fundo do card
function textOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#0e0e0e';
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#0e0e0e' : '#ffffff';
}

export function ProjectCard({ p }: { p: Project }) {
  const bg = p.cardColor || DEFAULT_COLOR;
  return (
    <Link href={`/project/${p.slug}/`} className="card">
      <div className="card-media">
        {p.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverUrl} alt="" loading="lazy" />
        ) : (
          <div className="placeholder">Capa</div>
        )}
        <div className="card-hover" style={{ background: bg, color: textOn(bg) }} aria-hidden="true">
          <span className="k">Cliente</span>
          <span className="v">{p.client}</span>
          <span className="t">{p.title}</span>
          {p.agency && (
            <>
              <span className="k">Agência</span>
              <span className="v">{p.agency}</span>
            </>
          )}
          <span className="d" />
          <span className="corner"><i>+</i></span>
        </div>
      </div>
      <div className="card-caption">
        {p.title}
        <small>{p.client}</small>
      </div>
    </Link>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="cards">
      {projects.map((p) => (
        <ProjectCard key={p.slug} p={p} />
      ))}
    </div>
  );
}
