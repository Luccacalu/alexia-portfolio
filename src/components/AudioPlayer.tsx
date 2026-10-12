'use client';

import { useRef, useState, type SyntheticEvent } from 'react';
import { Pause, Play } from 'lucide-react';
import type { AudioBlock } from '@/lib/types';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, '0')}`;
}

export function AudioPlayer({ value }: { value: AudioBlock }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }

  function seek(event: SyntheticEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(event.currentTarget.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <section className="pt-audio" aria-label={value.title || 'Faixa de áudio'}>
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          setCurrentTime(0);
          setIsPlaying(false);
        }}
      >
        <source src={value.url} type={value.mimeType} />
        Seu navegador não suporta este formato de áudio.
      </audio>

      <div className="pt-audio-player">
        <button
          className="pt-audio-toggle"
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
        >
          {isPlaying ? <Pause size={19} fill="currentColor" aria-hidden="true" /> : <Play size={19} fill="currentColor" aria-hidden="true" />}
        </button>
        <div className="pt-audio-timeline">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(currentTime, duration || 1)}
            onChange={seek}
            aria-label={`Progresso de ${value.title || 'áudio'}`}
            aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
            style={{ background: `linear-gradient(to right, var(--accent) ${progress}%, rgba(255,255,255,.18) ${progress}%)` }}
          />
          <div className="pt-audio-times" aria-hidden="true">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {(value.title || value.description) && (
        <div className="pt-audio-copy">
          {value.title && <h3>{value.title}</h3>}
          {value.description && <p>{value.description}</p>}
        </div>
      )}
    </section>
  );
}