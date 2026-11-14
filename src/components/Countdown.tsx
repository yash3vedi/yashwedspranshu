'use client';
import { useEffect, useState } from 'react';
import { wedding } from '@/config/wedding';

const TARGET = Date.parse(wedding.date.countdownTarget); // ISO with +05:30 → IST, correct in every timezone

function remaining() {
  const d = TARGET - Date.now();
  if (d <= 0) return null;
  return { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
}

/** Serif countdown; each number gently rolls when it changes (keyed remount). */
export function Countdown() {
  const [left, setLeft] = useState(remaining);
  useEffect(() => { const t = setInterval(() => setLeft(remaining()), 1000); return () => clearInterval(t); }, []);
  const units: [keyof NonNullable<typeof left>, string][] = [['d', 'Days'], ['h', 'Hours'], ['m', 'Minutes'], ['s', 'Seconds']];
  return (
    <section className="sec" id="countdown" aria-labelledby="cdTitle">
      <header className="sec-head">
        <h2 className="sec-title" id="cdTitle" data-reveal>The countdown begins</h2>
        <div className="rule" aria-hidden="true"><i /></div>
      </header>
      <div data-reveal>
        {left ? <>
          <div className="count" role="timer" aria-live="off">
            {units.map(([k, label]) => {
              const v = k === 'd' ? String(left[k]) : String(left[k]).padStart(2, '0');
              return <div className="unit" key={k}><span className="num roll" key={v}>{v}</span><span className="lbl">{label}</span></div>;
            })}
          </div>
          <p className="count-foot">{wedding.date.countFoot}</p>
        </> : <p className="count-done">{wedding.date.doneMessage.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}</p>}
      </div>
    </section>
  );
}
