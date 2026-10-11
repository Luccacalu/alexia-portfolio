import Link from 'next/link';
import { getSettings } from '@/lib/sanity';

export default async function Home() {
  const s = await getSettings();
  return (
    <main className="home">
      <p className="intro pre">{s.heroIntro}</p>

      <h1 className="display names">
        <span>{s.firstName}</span>
        <span>{s.lastName}</span>
      </h1>

      <div className="begin">
        <div>
          <p>Alguns começam pelo trabalho. Outros, pelas pessoas. Então, diga:</p>
          <h3 className="display">Por onde você quer começar?</h3>
        </div>
        <div className="btns">
          <Link className="btn" href="/projects/">Trabalhos</Link>
          <Link className="btn" href="/about/">Sobre</Link>
        </div>
      </div>
    </main>
  );
}
