import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <h1 className="display page-title">404</h1>
      <p className="foot-link" style={{ marginTop: 0 }}>
        Página não encontrada.<Link href="/">Voltar ao início</Link>
      </p>
    </main>
  );
}
