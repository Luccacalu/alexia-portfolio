'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Menu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className={`header ${open ? 'open' : ''}`}>
        <div className="cell l">
          <Link href="/" className="logo" aria-label="Início">
            <svg viewBox="0 0 40 24" aria-hidden="true">
              <ellipse cx="20" cy="12" rx="18" ry="10" />
              <ellipse cx="20" cy="12" rx="8" ry="10" />
              <line x1="2" y1="12" x2="38" y2="12" />
              <path d="M5 6.5h30M5 17.5h30" />
            </svg>
          </Link>
        </div>
        <div />
        <div className="cell r">
          <button
            className={`plus ${open ? 'open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
          >
            +
          </button>
        </div>
      </header>
      <div className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
        <h2 className="display">
          O que você
          <br />
          quer ver
          <br />
          agora?
        </h2>
        <nav>
          <Link href="/projects/" tabIndex={open ? 0 : -1}>Trabalhos</Link>
          <Link href="/about/" tabIndex={open ? 0 : -1}>Sobre</Link>
          <Link href="/contact/" tabIndex={open ? 0 : -1}>Contato</Link>
        </nav>
      </div>
    </>
  );
}
