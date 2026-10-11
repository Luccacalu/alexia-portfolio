import type { Block } from '@/lib/types';

export function toEmbed(url: string, background = false): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      const q = background ? '?background=1&autopause=0' : '?dnt=1';
      return `https://player.vimeo.com/video/${id}${q}`;
    }
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v');
      const q = background ? '?autoplay=1&mute=1&loop=1&controls=0&playlist=' + id : '';
      return `https://www.youtube-nocookie.com/embed/${id}${q}`;
    }
  } catch {}
  return url;
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="p-body">
      {blocks.map((b) => {
        if (b._type === 'textBlock') {
          return (
            <p key={b._key} className="b-text pre">
              {b.text}
            </p>
          );
        }
        if (b._type === 'imageBlock') {
          return (
            <div key={b._key} className={`b-img ${b.fullWidth ? '' : 'half'}`}>
              {b.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.url} alt={b.alt || ''} loading="lazy" />
              ) : (
                <div className="placeholder">Imagem</div>
              )}
            </div>
          );
        }
        return (
          <div key={b._key} className="video">
            <iframe
              src={toEmbed(b.url, b.background)}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title="Vídeo do projeto"
            />
          </div>
        );
      })}
    </div>
  );
}
