import type { Metadata, Viewport } from 'next';
import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/inter';
import './globals.css';
import Menu from '@/components/Menu';
import { getSettings } from '@/lib/sanity';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0e0e',
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: s.siteTitle, template: `%s | ${s.siteTitle}` },
    description: s.description,
    openGraph: { title: s.siteTitle, description: s.description, type: 'website' },
    twitter: { card: 'summary_large_image', title: s.siteTitle, description: s.description },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="frame">
          <Menu />
          {children}
        </div>
      </body>
    </html>
  );
}
