import type { Metadata } from 'next';
import { getSettings } from '@/lib/sanity';

export const metadata: Metadata = { title: 'Contato' };

export default async function Contact() {
  const s = await getSettings();
  return (
    <main className="page contact">
      <h1 className="display page-title">Vamos conversar?</h1>
      <a className="mail" href={`mailto:${s.email}`}>{s.email}</a>
      <div className="soc">
        {s.socials.map((x) => (
          <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a>
        ))}
      </div>
    </main>
  );
}
