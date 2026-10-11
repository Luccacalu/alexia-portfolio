import Link from 'next/link';
import Globe from '@/components/Globe';
import { getSettings } from '@/lib/sanity';

export default async function Home() {
  const s = await getSettings();
  return (
    <main className="home">
      <p className="intro pre">{s.heroIntro}</p>

      <h1 className="display names">
        <span>{s.firstName}</span>
        <Globe className="home-globe" />
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
