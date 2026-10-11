import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectGrid } from '@/components/ProjectCard';
import { getProjects } from '@/lib/sanity';

export const metadata: Metadata = { title: 'Todos os projetos' };

export default async function Projects() {
  const projects = await getProjects();
  return (
    <main>
      <div className="page-head">
        <h1 className="display">Todos os projetos</h1>
        <span className="dash" />
      </div>
      <div className="cards-wrap">
        <ProjectGrid projects={projects} />
      </div>
      <p className="foot-link">
        ou escolha por<Link href="/categories/">Categorias</Link>
      </p>
    </main>
  );
}
