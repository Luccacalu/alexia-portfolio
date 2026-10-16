import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/recursive/slnt.css';
import './globals.css';
import Menu from '@/components/Menu';
import { DevSanityRefresh } from '@/components/DevSanityRefresh';
import { getSettings } from '@/lib/sanity';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#173f63',
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: s.siteTitle, template: `%s | ${s.siteTitle}` },
    description: s.description,
    icons: { icon: '/rooster.png', apple: '/rooster.png' },
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
          <DevSanityRefresh
            enabled={process.env.NODE_ENV === 'development' && Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)}
          />
          {children}
        </div>
      </body>
    </html>
  );
}
