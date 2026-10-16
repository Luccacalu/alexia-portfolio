'use client';

import { useEffect, useRef } from 'react';

export default function HomeEffects() {
  const effectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const effects = effectsRef.current;
    const home = effects?.parentElement;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!home || !canHover.matches || prefersReducedMotion.matches) return;

    let frame = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      home.classList.remove('has-pointer');
      home.style.removeProperty('--pointer-x');
      home.style.removeProperty('--pointer-y');
      home.style.removeProperty('--star-x');
      home.style.removeProperty('--star-y');
      home.style.removeProperty('--hero-x');
      home.style.removeProperty('--hero-y');
    };

    const update = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = home.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        home.style.setProperty('--pointer-x', `${x * 100}%`);
        home.style.setProperty('--pointer-y', `${y * 100}%`);
        home.style.setProperty('--star-x', `${(0.5 - x) * 8.4}px`);
        home.style.setProperty('--star-y', `${(0.5 - y) * 8.4}px`);
        home.style.setProperty('--hero-x', `${(x - 0.5) * 4.2}px`);
        home.style.setProperty('--hero-y', `${(y - 0.5) * 4.2}px`);
        home.classList.add('has-pointer');
      });
    };

    home.addEventListener('pointermove', update, { passive: true });
    home.addEventListener('pointerleave', reset);

    return () => {
      home.removeEventListener('pointermove', update);
      home.removeEventListener('pointerleave', reset);
      reset();
    };
  }, []);

  return (
    <>
      <div className="home-effects" ref={effectsRef} aria-hidden="true" />
      <span className="home-cursor" aria-hidden="true" />
    </>
  );
}
