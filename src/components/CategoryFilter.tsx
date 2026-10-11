'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Project } from '@/lib/types';
import { ProjectGrid } from './ProjectCard';

export default function CategoryFilter({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const tag = params.get('tag');
  const cats = Array.from(new Set(projects.flatMap((p) => p.categories))).sort();
  const filtered = tag ? projects.filter((p) => p.categories.includes(tag)) : [];

  return (
    <>
      <div className="cats">
        {cats.map((c) => (
          <button
            key={c}
            className={c === tag ? 'active' : ''}
            onClick={() => router.push(`/categories/?tag=${encodeURIComponent(c)}`)}
          >
            {c}
          </button>
        ))}
      </div>
      {tag && (
        <div className="cards-wrap">
          <ProjectGrid projects={filtered} />
        </div>
      )}
    </>
  );
}
