'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ContactCta() {
  const pathname = usePathname();
  if (pathname.replace(/\/$/, '') === '/contact') return null;

  return (
    <section className="contact-cta" aria-label="Entre em contato">
      <span className="contact-cta__star" aria-hidden="true">
        ✦
      </span>
      <p className="contact-cta__eyebrow">Próximo passo</p>
      <h2 className="contact-cta__title">Vamos criar algo juntos?</h2>
      <Link className="contact-cta__link" href="/contact/#contact-details">
        Entrar em contato
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
