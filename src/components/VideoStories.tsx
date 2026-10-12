'use client';

import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProjectVideo } from '@/lib/types';

type StoryClip = NonNullable<ProjectVideo['story']>['clips'][number];

function clipsFor(video: ProjectVideo): StoryClip[] {
  return video.story?.clips ?? [];
}

function StoryViewer({
  video,
  onClose,
}: {
  video: ProjectVideo;
  onClose: () => void;
}) {
  const clips = useMemo(() => clipsFor(video), [video]);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const activeClip = clips[activeIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') setActiveIndex((index) => Math.max(0, index - 1));
      if (event.key === 'ArrowRight') setActiveIndex((index) => Math.min(clips.length - 1, index + 1));
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [clips.length, onClose]);

  function moveBy(amount: number) {
    setActiveIndex((index) => Math.max(0, Math.min(clips.length - 1, index + amount)));
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.changedTouches[0];
    touchStartX.current = touch?.clientX ?? null;
    touchStartY.current = touch?.clientY ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    const startY = touchStartY.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartX.current = null;
    touchStartY.current = null;
    if (startX === null || endX === undefined || startY === null || endY === undefined) return;
    const distance = startX - endX;
    const verticalDistance = endY - startY;
    if (verticalDistance > 85 && verticalDistance > Math.abs(distance) * 1.2) {
      onClose();
      return;
    }
    if (Math.abs(distance) > 55 && Math.abs(distance) > Math.abs(verticalDistance) * 1.2) {
      moveBy(distance > 0 ? 1 : -1);
    }
  }

  if (!activeClip) return null;

  return createPortal(
    <div
      className="video-story-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="video-story-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={video.title || 'Story do projeto'}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="video-story-progress" aria-label={`Clipe ${activeIndex + 1} de ${clips.length}`}>
          {clips.map((clip, index) => (
            <span className={index <= activeIndex ? 'complete' : ''} key={clip._key || `${index}-${clip.url}`} />
          ))}
        </div>
        <header className="video-story-header">
          <span>{video.title || 'Story do projeto'}</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar Stories">
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <video
          ref={videoRef}
          key={activeClip._key || activeClip.url}
          className="video-story-clip"
          autoPlay
          playsInline
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          onContextMenu={(event) => event.preventDefault()}
          onEnded={() => (activeIndex < clips.length - 1 ? moveBy(1) : onClose())}
          aria-label={`${video.title || 'Story'}, clipe ${activeIndex + 1}`}
        >
          <source src={activeClip.url} type={activeClip.mimeType} />
          Seu navegador não consegue reproduzir este formato.
        </video>

        {activeIndex > 0 && (
          <button className="video-story-nav previous" type="button" onClick={() => moveBy(-1)} aria-label="Story anterior">
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
        )}
        {activeIndex < clips.length - 1 && (
          <button className="video-story-nav next" type="button" onClick={() => moveBy(1)} aria-label="Próximo story">
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        )}
        <span className="video-story-index">{activeIndex + 1} / {clips.length}</span>
      </section>
    </div>,
    document.body,
  );
}

export function VideoStories({ video, storageScope }: { video: ProjectVideo; storageScope: string }) {
  const clips = useMemo(() => clipsFor(video), [video]);
  const hasStory = Boolean(video.story?.coverUrl && clips.length > 0);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [isOpen, setIsOpen] = useState(false);
  const key = `${storageScope}:${video._key}`;

  useEffect(() => {
    try {
      if (window.localStorage.getItem(`portfolio-story-seen:${key}`) === '1') {
        setSeen((current) => new Set(current).add(key));
      }
    } catch {
      return;
    }
  }, [key]);

  if (!hasStory) return null;

  function openStory() {
    setSeen((current) => new Set(current).add(key));
    try {
      window.localStorage.setItem(`portfolio-story-seen:${key}`, '1');
    } catch {
      // Keep the viewed state for this page session if storage is unavailable.
    }
    setIsOpen(true);
  }

  return (
    <div className="video-stories">
      <button
        className={`video-story-bubble${seen.has(key) ? ' seen' : ''}`}
        type="button"
        onClick={openStory}
        aria-label={`Abrir story de ${video.title || 'vídeo'}`}
      >
        <span className="video-story-bubble-ring">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={video.story?.coverUrl} alt="" loading="lazy" />
        </span>
        <span className="video-story-bubble-label">{video.story?.label || 'Story'}</span>
      </button>
      {isOpen && <StoryViewer video={video} onClose={() => setIsOpen(false)} />}
    </div>
  );
}