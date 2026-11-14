'use client';
import { useRef } from 'react';
import { wedding } from '@/config/wedding';
import { Monogram, Names } from './Monogram';
import { useInvitation } from './InvitationContext';
import { useOnceVisible } from '@/lib/hooks';

/** The closing frame: statement, names, monogram, sign-off — with a last drift of petals. */
export function FinalSection() {
  const { fx } = useInvitation();
  const sec = useRef<HTMLElement>(null);
  useOnceVisible(sec, () => {
    fx.current?.emit('petal', 14000, p => 1.6 * (1 - p) + .3);
    setTimeout(() => fx.current?.emit('mote', 9000, () => 3, { up: true, y: () => innerHeight * (.5 + Math.random() * .5) }), 1800);
  }, .45);
  const f = wedding.finale;
  return (
    <section ref={sec} className="sec finale" id="finale" aria-labelledby="finTitle">
      <h2 className="finale-big" id="finTitle" data-reveal="mask">
        {f.statement.map(l => <span className="line" key={l}><span>{l}</span></span>)}
      </h2>
      <div data-reveal style={{ ['--dl' as string]: '.5s' }}>
        <p className="finale-names"><Names /></p>
        <p className="finale-tag">{wedding.couple.hashtag}</p>
        <p className="finale-date">{wedding.date.displayDate}</p>
      </div>
      <div className="coda" data-reveal style={{ ['--dl' as string]: '.3s' }}>
        <Monogram size="clamp(96px,22vw,128px)" />
        <p className="coda-line">{f.line}</p>
        <p className="coda-love">With love,</p>
        <p className="coda-sig">{f.signature}</p>
      </div>
      <div className="end-space" />
    </section>
  );
}
