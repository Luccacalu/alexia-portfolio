import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type {
  AudioBlock,
  BodyBlock,
  CarouselBlock,
  CardsBlock,
  FigureBlock,
  GalleryBlock,
  VideoBlock,
  VideoFileBlock,
} from '@/lib/types';
import { AudioPlayer } from './AudioPlayer';
import { ImageCarousel } from './ImageCarousel';
import { ProjectGrid } from './ProjectCard';

export function toEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return `https://player.vimeo.com/video/${id}?dnt=1`;
    }
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v');
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {}
  return url;
}

function Figure({ value }: { value: FigureBlock }) {
  const layout = value.layout || 'wide';
  return (
    <figure className={`pt-figure ${layout}`}>
      {value.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value.url} alt={value.alt || ''} loading="lazy" />
      ) : (
        <div className="placeholder">Imagem</div>
      )}
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}

function Gallery({ value }: { value: GalleryBlock }) {
  const n = value.images?.length || 0;
  return (
    <div className={`pt-gallery cols-${Math.min(n, 3) || 1}`}>
      {(value.images ?? []).map((im, i) => (
        <figure key={i}>
          {im.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={im.url} alt={im.alt || ''} loading="lazy" />
          ) : (
            <div className="placeholder">Imagem</div>
          )}
          {im.caption && <figcaption>{im.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function Video({ value }: { value: VideoBlock }) {
  if (!value.url) return null;
  return (
    <figure className="pt-video">
      <div className="video">
        <iframe
          src={toEmbed(value.url)}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title={value.caption || 'Vídeo'}
        />
      </div>
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}

function VideoFile({ value }: { value: VideoFileBlock }) {
  if (!value.url) return null;
  return (
    <figure className="pt-video">
      <video
        className="pt-video-file"
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        preload="metadata"
        aria-label={value.filename || 'Vídeo'}
      >
        <source src={value.url} type={value.mimeType} />
        Seu navegador não consegue reproduzir este formato.
      </video>
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}

function Cards({ value }: { value: CardsBlock }) {
  if (!value.items?.length) return null;
  return (
    <section className="pt-cards">
      {value.heading && <h2 className="display">{value.heading}</h2>}
      <ProjectGrid projects={value.items} />
    </section>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="pt-p">{children}</p>,
    h2: ({ children }) => <h2 className="display pt-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="display pt-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="pt-h4">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="display pt-quote">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="pt-ul">{children}</ul>,
    number: ({ children }) => <ol className="pt-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ children, value }) => (
      <a href={value?.href} target={value?.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    figure: ({ value }) => <Figure value={value} />,
    gallery: ({ value }) => <Gallery value={value} />,
    carousel: ({ value }) => <ImageCarousel value={value as CarouselBlock} />,
    audio: ({ value }) => <AudioPlayer value={value as AudioBlock} />,
    video: ({ value }) => <Video value={value} />,
    videoFile: ({ value }) => <VideoFile value={value} />,
    cards: ({ value }) => <Cards value={value} />,
  },
};

export function PortableBody({ value }: { value: BodyBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="portable">
      <PortableText value={value as any} components={components} />
    </div>
  );
}
