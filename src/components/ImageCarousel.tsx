'use client';

import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { CarouselBlock } from '@/lib/types';

export function ImageCarousel({ value }: { value: CarouselBlock }) {
  const slides = (value.images ?? []).filter((slide) => slide.url);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoAspectRatios, setVideoAspectRatios] = useState<Record<string, number>>({});
  const [stageWidth, setStageWidth] = useState<number>();
  const carouselRef = useRef<HTMLElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const activeSlide = slides[activeIndex];
  const activeSlideKey = activeSlide?._key || `${activeIndex}-${activeSlide?.url}`;
  const activeAspectRatio = activeSlide?._type === 'file'
    ? videoAspectRatios[activeSlideKey] || 16 / 9
    : activeSlide?.aspectRatio || 4 / 3;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateStageWidth = () => {
      const maxHeight = Math.min(window.innerHeight * 0.68, 680);
      const width = Math.min(carousel.clientWidth, maxHeight * activeAspectRatio);
      setStageWidth((current) => (current && Math.abs(current - width) < 1 ? current : width));
    };
    const observer = new ResizeObserver(updateStageWidth);
    observer.observe(carousel);
    window.addEventListener('resize', updateStageWidth);
    updateStageWidth();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateStageWidth);
    };
  }, [activeAspectRatio]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video) return;
    if (prefersReducedMotion || isPaused) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
    return () => video.pause();
  }, [activeIndex, isPaused, prefersReducedMotion]);

  useEffect(() => {
    if (slides.length < 2 || isPaused || prefersReducedMotion || activeSlide?._type === 'file') return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [activeSlide?._type, slides.length, isPaused, prefersReducedMotion]);

  if (!slides.length) return null;

  function moveBy(amount: number) {
    setActiveIndex((index) => (index + amount + slides.length) % slides.length);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX === null || endX === undefined || slides.length < 2) return;
    const distance = startX - endX;
    if (Math.abs(distance) > 45) moveBy(distance > 0 ? 1 : -1);
  }

  return (
    <section
      ref={carouselRef}
      className="pt-carousel"
      aria-roledescription="carrossel"
      aria-label={value.title || 'Carrossel de imagens'}
    >
      {(value.title || value.description) && (
        <header className="pt-carousel-heading">
          {value.title && <h2 className="display">{value.title}</h2>}
          {value.description && <p>{value.description}</p>}
        </header>
      )}

      <div className="pt-carousel-frame">
        <div
          className="pt-carousel-viewport"
          style={{
            width: stageWidth ? `${stageWidth}px` : `min(100%, ${Math.min(420, 680 * activeAspectRatio)}px)`,
            aspectRatio: String(activeAspectRatio),
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="pt-carousel-track" style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}>
            {slides.map((slide, index) => (
              <figure
                className="pt-carousel-slide"
                key={slide._key || `${index}-${slide.url}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${slides.length}`}
                aria-hidden={index !== activeIndex}
              >
                {slide._type === 'file' ? (
                  <video
                    ref={index === activeIndex ? activeVideoRef : undefined}
                    autoPlay={index === activeIndex && !prefersReducedMotion}
                    muted
                    playsInline
                    controls
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    preload={index === activeIndex ? 'auto' : 'metadata'}
                    onContextMenu={(event) => event.preventDefault()}
                    onEnded={() => {
                      if (!isPaused) moveBy(1);
                    }}
                    onLoadedMetadata={(event) => {
                      const { videoWidth, videoHeight } = event.currentTarget;
                      if (videoWidth && videoHeight) {
                        const ratio = videoWidth / videoHeight;
                        setVideoAspectRatios((current) => ({ ...current, [slide._key || `${index}-${slide.url}`]: ratio }));
                      }
                    }}
                    aria-label={slide.filename || `Vídeo ${index + 1}`}
                  >
                    <source src={slide.url} type={slide.mimeType} />
                    Seu navegador não consegue reproduzir este formato.
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.url} alt={slide.alt || ''} loading={index === activeIndex ? 'eager' : 'lazy'} draggable={false} />
                )}
                {slide._type !== 'file' && slide.caption && <figcaption>{slide.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button className="pt-carousel-arrow previous" type="button" onClick={() => moveBy(-1)} aria-label="Slide anterior">
              <ChevronLeft size={21} aria-hidden="true" />
            </button>
            <button className="pt-carousel-arrow next" type="button" onClick={() => moveBy(1)} aria-label="Próximo slide">
              <ChevronRight size={21} aria-hidden="true" />
            </button>
            <div className="pt-carousel-controls">
              <span className="pt-carousel-count">{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
              <button
                className="pt-carousel-play"
                type="button"
                onClick={() => setIsPaused((paused) => !paused)}
                aria-label={isPaused ? 'Retomar avanço automático' : 'Pausar avanço automático'}
                aria-pressed={isPaused}
              >
                {isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}