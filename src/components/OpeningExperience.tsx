'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { wedding } from '@/config/wedding';
import { Monogram, Names } from './Monogram';
import { Motif } from './Motif';
import { useInvitation } from './InvitationContext';
import { wait } from '@/lib/hooks';

/** Full-screen cover that parts like a gatefold when the guest enters. */
export function OpeningExperience({ onEnter, onOpened }: { onEnter: () => void; onOpened: () => void }) {
  const { fx, reduced } = useInvitation();
  const [phase, setPhase] = useState<'idle' | 'parting' | 'open' | 'gone'>('idle');
  const { opening } = wedding;

  useEffect(() => {
    const t = setTimeout(() => fx.current?.emit('mote', 60000, () => 1.6, { up: true, y: () => innerHeight * (.55 + Math.random() * .45) }), 300);
    return () => clearTimeout(t);
  }, [fx]);

  async function enter() {
    if (phase !== 'idle') return;
    onEnter();                         // starts music inside the click (autoplay rules)
    fx.current?.stopMotes();
    setPhase('parting');
    await wait(reduced ? 50 : 750);
    setPhase('open');
    await wait(reduced ? 50 : 1500);
    setPhase('gone');
    onOpened();
  }

  if (phase === 'gone') return null;
  const cls = 'opening' + (phase !== 'idle' ? ' parting' : '') + (phase === 'open' ? ' open' : '');
  return (
    <section className={cls} aria-label="Invitation cover">
      <div className="door door-l" aria-hidden="true" />
      <div className="door door-r" aria-hidden="true" />
      <div className="arch">
        <div className="op-step" style={{ ['--d' as string]: '.2s' }}>
          {opening.ganeshaArt
            ? <Image className="ganesha-art" src={opening.ganeshaArt} alt="Lord Ganesha" width={64} height={64} priority />
            : <div className="op-lotus"><Motif name="lotus" /></div>}
        </div>
        <p className="shloka op-step" style={{ ['--d' as string]: '.4s' }} lang="sa">{opening.shloka}</p>
        <div className="op-step" style={{ ['--d' as string]: '.9s' }}><Monogram size="clamp(108px,30vw,132px)" /></div>
        <h1 className="op-names op-step" style={{ ['--d' as string]: '2.4s' }}><Names /></h1>
        <p className="op-tag op-step" style={{ ['--d' as string]: '3.1s' }}>{opening.tagline.map(l => <span key={l}>{l}</span>)}</p>
        <div className="op-step" style={{ ['--d' as string]: '3.8s' }}>
          <button className="btn" type="button" onClick={enter}>Enter invitation</button>
        </div>
      </div>
    </section>
  );
}
