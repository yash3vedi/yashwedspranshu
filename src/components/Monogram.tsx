import { useId } from 'react';
import { wedding } from '@/config/wedding';

/** The Y ✦ P seal inside a thin champagne → rose-gold ring. */
export function Monogram({ size = '120px' }: { size?: string }) {
  const [a, b] = wedding.couple.initials;
  const id = 'mg' + useId().replace(/:/g, '');
  return (
    <span className="seal" style={{ ['--s' as string]: size }} role="img" aria-label={`${a} and ${b} monogram`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D9BF94" /><stop offset=".5" stopColor="#C9A66B" /><stop offset="1" stopColor="#B9827A" />
          </linearGradient>
        </defs>
        <circle className="ring" cx="60" cy="60" r="58" fill="none" stroke={`url(#${id})`} strokeWidth=".8" />
        <circle cx="60" cy="60" r="53.5" fill="none" stroke={`url(#${id})`} strokeWidth=".4" opacity=".55" />
      </svg>
      <span className="mono" aria-hidden="true"><span className="y">{a}</span><span className="st">✦</span><span className="p">{b}</span></span>
    </span>
  );
}

export function Names() {
  const [a, b] = wedding.couple.first;
  return <>{a}<span className="heart" aria-label="and">♥</span>{b}</>;
}
