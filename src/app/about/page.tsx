import type { Metadata } from 'next';
import { getSettings } from '@/lib/sanity';

export const metadata: Metadata = { title: 'Sobre' };

export default async function About() {
  const s = await getSettings();
  return (
    <main className="page">
      <h1 className="display page-title">Sobre</h1>

      <section className="a-intro">
        <h2 className="display">Quem sou</h2>
        <div className="txt pre">{s.aboutIntro}</div>
      </section>

      <section className="person">
        <div>
          <h2 className="display">
            {s.firstName}
            <br />
            {s.lastName}
          </h2>
          <p className="role">{s.role}</p>
        </div>
        <div>
          {s.portraitUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.portraitUrl} alt={`${s.firstName} ${s.lastName}`} />
          ) : (
            <div className="placeholder">Foto</div>
          )}
          <div className="dl">
            {s.sections.map((sec) => (
              <div key={sec.title}>
                <h4>{sec.title}</h4>
                <ul>
                  {sec.items.map((it, i) => (
                    <li key={i}>
                      <span>{it.label}</span>
                      {it.detail && <span className="pre">{it.detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {s.clientGroups.length > 0 && (
        <section className="clients">
          <h2 className="display sec-title">Clientes</h2>
          {s.clientGroups.map((g) => (
            <div className="cgroup" key={g.category}>
              <div className="eyebrow">{g.category}</div>
              <div className="logos">
                {g.logos.map((l, i) =>
                  l.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={l.url} alt={l.name || ''} loading="lazy" />
                  ) : (
                    <span key={i}>{l.name}</span>
                  )
                )}
              </div>
            </div>
          ))}
        </section>
      )}

    </main>
  );
}
