import type { Metadata } from 'next';
import { SocialIcon } from '@/components/SocialIcon';
import { getSettings } from '@/lib/sanity';

export const metadata: Metadata = { title: 'Contato' };

export default async function Contact() {
  const s = await getSettings();
  return (
    <main className="page contact" id="contact-details">
      <h1 className="display page-title contact-title">Vamos conversar?</h1>
      <a className="mail" href={`mailto:${s.email}`}>
        {s.email}
      </a>
      <div className="soc">
        {s.socials.map((x) => (
          <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer">
            <SocialIcon label={x.label} />
            <span>{x.label}</span>
          </a>
        ))}
      </div>
    </main>
  );
}
