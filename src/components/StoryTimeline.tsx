'use client';
import { useEffect, useRef } from 'react';
import { wedding, type Chapter } from '@/config/wedding';
import { Names } from './Monogram';
import { useInvitation } from './InvitationContext';
import { useOnceVisible } from '@/lib/hooks';

function Years({ to }: { to: number }) {
  const { reduced } = useInvitation();
  const el = useRef<HTMLSpanElement>(null);
  useOnceVisible(el, () => {
    if (reduced) { el.current!.textContent = to + '+'; return; }
    const st = performance.now();
    const f = (t: number) => { const p = Math.min(1, (t - st) / 1800); el.current!.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + '+'; if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }, .5);
  return <span ref={el} className="years" aria-label={`${to} plus years`}>0+</span>;
}

function ChapterView({ ch, n }: { ch: Chapter; n: string }) {
  if (ch.final) return (
    <article className="chapter final"><div className="ch-body">
      <p className="ch-title" data-reveal>{ch.title}</p>
      <p className="final-big" data-reveal="mask"><span className="line"><span>{ch.big}</span></span></p>
      <p className="final-names" data-reveal style={{ ['--dl' as string]: '.3s' }}><Names /></p>
      <p className="final-sig" data-reveal style={{ ['--dl' as string]: '.6s' }}>{ch.sig}</p>
    </div></article>
  );
  const lines = ch.lines ?? [];
  return (
    <article className="chapter">
      <div className="ch-num" aria-hidden="true">{n}</div>
      <div className="ch-body">
        <p className="ch-title" data-reveal><span className="sr-only">Chapter {n}: </span>{ch.title}</p>
        {ch.years && <Years to={ch.years} />}
        {lines.map((l, k) => (
          <p key={k} className={`ch-line${k && lines.length === 2 ? ' soft' : ''}`} data-reveal style={{ ['--dl' as string]: `${.15 + k * .35}s` }}>{l}</p>
        ))}
        {ch.notif && <div data-reveal style={{ ['--dl' as string]: '.7s' }}><span className="notif"><i aria-hidden="true" />{ch.notif}</span></div>}
      </div>
    </article>
  );
}

/** Cinematic chapters along a gold thread that fills as you scroll. */
export function StoryTimeline() {
  const { music, reduced } = useInvitation();
  const sec = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null), fill = useRef<HTMLElement>(null);
  useOnceVisible(sec, () => music.current?.setLevel(2), .1);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        ticking = false; const vh = innerHeight, r = track.current!.getBoundingClientRect();
        fill.current!.style.transform = `scaleY(${Math.max(0, Math.min(1, (vh * .6 - r.top) / r.height))})`;
        if (reduced) return;
        track.current!.querySelectorAll<HTMLElement>('.ch-num').forEach(n => {
          const b = n.getBoundingClientRect(); if (b.bottom < -100 || b.top > vh + 100) return;
          n.style.setProperty('--shift', `${((b.top + b.height / 2) - vh / 2) * -.12}px`);
        });
      });
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, [reduced]);

  return (
    <section ref={sec} className="sec" id="story" aria-labelledby="storyTitle">
      <header className="sec-head">
        <h2 className="sec-title" id="storyTitle" data-reveal>Our story</h2>
        <div className="rule" aria-hidden="true"><i /></div>
        <p className="sec-sub" data-reveal style={{ ['--dl' as string]: '.15s' }}>{wedding.storySub}</p>
      </header>
      <div className="story-track" ref={track}>
        <div className="thread" aria-hidden="true"><b ref={fill} /></div>
        <div>{wedding.story.map((ch, i) => <ChapterView key={i} ch={ch} n={String(i + 1).padStart(2, '0')} />)}</div>
      </div>
    </section>
  );
}
