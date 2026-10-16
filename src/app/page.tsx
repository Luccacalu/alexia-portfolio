import Link from 'next/link';
import Image from 'next/image';
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

      {s.heroLogoUrl ? (
        <h1 className="display home-logo-title">
          <Image
            className="home-logo"
            src={s.heroLogoUrl}
            alt={`${s.firstName} ${s.lastName}`.trim()}
            width={s.heroLogoWidth || 1}
            height={s.heroLogoHeight || 1}
            priority
          />
        </h1>
      ) : (
        <h1 className="display names">
          <span>{s.firstName}</span>
          <span>{s.lastName}</span>
        </h1>
      )}

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
