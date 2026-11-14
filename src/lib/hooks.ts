'use client';
import { useEffect, useState } from 'react';

export const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Adds `.in` to every [data-reveal] inside root when it scrolls into view. */
export function useRevealObserver(root: React.RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    if (!active || !root.current) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
    root.current.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [root, active]);
}

/** Runs cb once when the element is at least `threshold` visible. */
export function useOnceVisible(ref: React.RefObject<Element | null>, cb: () => void, threshold = .1, rootMargin = '0px') {
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); cb(); } }, { threshold, rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
