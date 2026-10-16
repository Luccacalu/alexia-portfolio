import Link from 'next/link';
import { getSettings } from '@/lib/sanity';

export default async function Home() {
  const s = await getSettings();
  return (
    <main className="home">
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <p className="intro pre">{s.heroIntro}</p>

      <h1 className="display names">
        <span>{s.firstName}</span>
        <span>{s.lastName}</span>
      </h1>

      <div className="begin">
        <p className="pre">{s.beginLead}</p>
        <h2 className="display">{s.beginQuestion}</h2>
        <div className="btns">
          <Link className="btn" href="/projects/">
            Trabalhos
          </Link>
          <Link className="btn" href="/about/">
            Sobre
          </Link>
        </div>
      </div>
    </main>
  );
}
