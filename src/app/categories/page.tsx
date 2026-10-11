import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import CategoryFilter from '@/components/CategoryFilter';
import { getProjects } from '@/lib/sanity';

export const metadata: Metadata = { title: 'Categorias' };

export default async function Categories() {
  const projects = await getProjects();
  return (
    <main>
      <div className="page-head">
        <h1 className="display">Categorias</h1>
        <span className="dash" />
      </div>
      <Suspense fallback={null}>
        <CategoryFilter projects={projects} />
      </Suspense>
      <p className="foot-link">
        ou veja<Link href="/projects/">Todos os projetos</Link>
      </p>
    </main>
  );
}
