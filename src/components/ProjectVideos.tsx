'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import type { ProjectVideo } from '@/lib/types';
import { PortableBody } from './PortableBody';
import { VideoStories } from './VideoStories';

const numberFormat = new Intl.NumberFormat('pt-BR');

function VideoStory({ video, index, storageScope }: { video: ProjectVideo; index: number; storageScope: string }) {
  const [aspectRatio, setAspectRatio] = useState('9 / 16');
  const [playerHeight, setPlayerHeight] = useState<number>();
  const playerRef = useRef<HTMLVideoElement>(null);
  const metrics = video.metrics;
  const hasMetrics = Object.values(metrics ?? {}).some(
    (value) => typeof value === 'number' && Number.isFinite(value),
  );

  function updateAspectRatio(event: SyntheticEvent<HTMLVideoElement>) {
    const { videoWidth, videoHeight } = event.currentTarget;
    if (videoWidth > 0 && videoHeight > 0) {
      setAspectRatio(`${videoWidth} / ${videoHeight}`);
    }
  }

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const observer = new ResizeObserver(() => {
      const height = player.getBoundingClientRect().height;
      if (height > 0) setPlayerHeight(Math.round(height));
    });

    observer.observe(player);
    return () => observer.disconnect();
  }, []);

  return (
    <article className="video-story">
      {video.title && <h2 className="display video-story-title">{video.title}</h2>}
      <div className={`video-story-layout${video.body.length ? ' has-script' : ''}`}>
        <figure className="video-story-media">
          <video
            ref={playerRef}
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            preload="metadata"
            onLoadedMetadata={updateAspectRatio}
            onContextMenu={(event) => event.preventDefault()}
            style={{ aspectRatio }}
            aria-label={video.title || `Vídeo ${index + 1}`}
          >
            <source src={video.url} type={video.mimeType} />
            Seu navegador não consegue reproduzir este formato.
          </video>
          {hasMetrics && (
            <ul className="video-story-metrics" aria-label="Métricas do vídeo">
              {typeof metrics?.views === 'number' && (
                <li><Eye size={20} strokeWidth={1.8} aria-hidden="true" /><span>{numberFormat.format(metrics.views)} visualizações</span></li>
              )}
              {typeof metrics?.likes === 'number' && (
                <li><Heart size={20} strokeWidth={1.8} aria-hidden="true" /><span>{numberFormat.format(metrics.likes)} likes</span></li>
              )}
              {typeof metrics?.shares === 'number' && (
                <li><Share2 size={20} strokeWidth={1.8} aria-hidden="true" /><span>{numberFormat.format(metrics.shares)} compartilhamentos</span></li>
              )}
              {typeof metrics?.comments === 'number' && (
                <li><MessageCircle size={20} strokeWidth={1.8} aria-hidden="true" /><span>{numberFormat.format(metrics.comments)} comentários</span></li>
              )}
            </ul>
          )}
          <VideoStories video={video} storageScope={storageScope} />
        </figure>
        {video.body.length > 0 && (
          <div className="video-story-script" style={{ maxHeight: playerHeight }}>
            <PortableBody value={video.body} />
          </div>
        )}
      </div>
    </article>
  );
}

export function ProjectVideos({ videos, storageScope }: { videos: ProjectVideo[]; storageScope: string }) {
  if (!videos.length) return null;

  return (
    <section className="project-videos" aria-label="Vídeos do projeto">
      {videos.map((video, index) => (
        <VideoStory key={video._key} video={video} index={index} storageScope={storageScope} />
      ))}
    </section>
  );
}