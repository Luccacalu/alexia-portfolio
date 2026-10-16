'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function headerTheme(pathname: string): string {
  if (pathname.startsWith('/projects')) return 'theme-projects';
  if (pathname.startsWith('/categories')) return 'theme-categories';
  if (pathname.startsWith('/about')) return 'theme-about';
  if (pathname.startsWith('/contact')) return 'theme-contact';
  if (pathname.startsWith('/project/')) return 'theme-project';
  return 'theme-home';
}

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
      <header className={`header ${headerTheme(pathname)} ${open ? 'open' : ''}`}>
        <div className="cell l">
          <Link href="/" className="logo" aria-label="Início">
            <img src="/rooster.png" alt="" />
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
          <Link href="/projects/" tabIndex={open ? 0 : -1}>
            Trabalhos
          </Link>
          <Link href="/about/" tabIndex={open ? 0 : -1}>
            Sobre
          </Link>
          <Link href="/contact/" tabIndex={open ? 0 : -1}>
            Contato
          </Link>
        </nav>
      </div>
    </>
  );
}
