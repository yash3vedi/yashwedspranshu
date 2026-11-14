'use client';
import { useEffect, useRef, useState } from 'react';
import { wedding } from '@/config/wedding';
import { useInvitation } from './InvitationContext';
import { DateReveal } from './DateReveal';
import { wait } from '@/lib/hooks';

/** Foil colours (rose gold → champagne). */
const FOIL: [number, string][] = [[0, '#E6C3B1'], [.22, '#C8978A'], [.46, '#F0D9C7'], [.62, '#D7AE95'], [.8, '#B9827A'], [1, '#DDB99C']];
const REVEAL_AT = .5; // fraction scratched before the foil dissolves

/**
 * Rose-gold scratch card. Sequence on reveal:
 * foil dissolves → date settles → 0.5s pause → one petal → gentle shower → gold motes + music swell → rest unlocks.
 */
export function ScratchReveal({ active, onRevealed }: { active: boolean; onRevealed: () => void }) {
  const { fx, music, reduced } = useInvitation();
  const card = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'idle' | 'scratching' | 'revealed' | 'settled'>('idle');
  const [after, setAfter] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (!active) return;
    const canvas = cv.current!, el = card.current!, c = canvas.getContext('2d', { willReadFrequently: true })!;
    let W = 0, H = 0, dpr = 1, down = false, touched = false, moves = 0;
    let last: { x: number; y: number } | null = null;

    const spaced = (txt: string, x: number, y: number, sp: number) => {
      const chars = [...txt], ws = chars.map(ch => c.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
      let cx = x - total / 2; chars.forEach((ch, i) => { c.fillText(ch, cx + ws[i] / 2, y); cx += ws[i] + sp; });
    };
    const star = (x: number, y: number, r: number) => {
      c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(x + Math.cos(a - Math.PI / 2) * rr, y + Math.sin(a - Math.PI / 2) * rr); } c.closePath(); c.fill();
    };
    const draw = () => {
      c.globalCompositeOperation = 'source-over';
      const g = c.createLinearGradient(0, 0, W, H); FOIL.forEach(([o, col]) => g.addColorStop(o, col));
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let y = 0; y < H; y += 2) { c.fillStyle = `rgba(${Math.random() < .5 ? '255,250,245' : '120,80,70'},${.02 + Math.random() * .04})`; c.fillRect(0, y, W, 1); }
      for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(255,252,248,${.15 + Math.random() * .45})`; c.fillRect(Math.random() * W, Math.random() * H, .5 + Math.random(), .5 + Math.random()); }
      c.strokeStyle = 'rgba(255,250,244,.55)'; c.lineWidth = 1; const ins = 16, r = W / 2 - ins;
      c.beginPath(); c.moveTo(ins, H - ins); c.lineTo(ins, r + ins); c.arc(W / 2, r + ins, r, Math.PI, 0); c.lineTo(W - ins, H - ins); c.closePath(); c.stroke();
      c.fillStyle = 'rgba(255,253,250,.95)'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.shadowColor = 'rgba(110,70,60,.25)'; c.shadowBlur = 6;
      star(W / 2, H * .36, 11);
      c.font = `500 ${Math.max(11, W * .036)}px Jost, sans-serif`; spaced('SCRATCH TO REVEAL', W / 2, H * .5, W * .018);
      c.font = `italic 400 ${Math.max(18, W * .07)}px "Bodoni Moda", Georgia, serif`; c.fillText('Our Wedding Date', W / 2, H * .6);
      star(W * .2, H * .6, 5); star(W * .8, H * .6, 5);
      c.shadowBlur = 0;
    };
    const size = () => {
      const r = el.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height;
      canvas.width = W * dpr | 0; canvas.height = H * dpr | 0; c.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
    };
    const pos = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const rub = (p: { x: number; y: number }) => {
      c.globalCompositeOperation = 'destination-out'; c.lineCap = 'round'; c.lineJoin = 'round';
      const lw = Math.max(40, W * .14); c.lineWidth = lw; c.beginPath();
      if (last) { c.moveTo(last.x, last.y); c.lineTo(p.x, p.y); c.stroke(); } else { c.arc(p.x, p.y, lw / 2, 0, 6.29); c.fill(); }
      last = p;
    };
    const check = () => {
      if (done.current) return;
      const x0 = W * .12 * dpr | 0, y0 = H * .28 * dpr | 0, w = W * .76 * dpr | 0, h = H * .62 * dpr | 0;
      const d = c.getImageData(x0, y0, w, h).data; let clear = 0, tot = 0;
      for (let i = 3; i < d.length; i += 64) { tot++; if (d[i] < 60) clear++; }
      if (clear / tot > REVEAL_AT) reveal();
    };
    const onDown = (e: PointerEvent) => { if (done.current) return; down = true; touched = true; canvas.setPointerCapture(e.pointerId); last = null; setState('scratching'); rub(pos(e)); };
    const onMove = (e: PointerEvent) => { if (!down) return; (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach(ev => rub(pos(ev))); if (++moves % 8 === 0) check(); };
    const onUp = () => { if (!down) return; down = false; last = null; check(); };
    const onResize = () => { if (!touched && !done.current) size(); };

    let cancelled = false;
    document.fonts.ready.then(() => { if (!cancelled) requestAnimationFrame(size); });
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp);
    addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelled = true;
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
      removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function reveal() {
    if (done.current) return; done.current = true;
    const t = (ms: number) => wait(reduced ? 0 : ms);
    setState('revealed');
    const r = card.current!.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    await t(950);                                   // foil dissolves, date settles
    await t(500);                                   // the pause — an emotional beat
    fx.current?.firstPetal();                       // one petal, alone
    await t(700);
    fx.current?.emit('petal', 5200, p => p < .25 ? 4 + p * 60 : 19 * Math.pow(1 - p, 2.2)); // shower that calms
    music.current?.setLevel(1);                     // strings + santoor enter
    setState('settled');
    await t(450);
    fx.current?.sparkle(cx, cy, 26);
    fx.current?.emit('petal', 30000, () => .2);     // a few stragglers keep drifting
    await t(900);
    setAfter(true);
    onRevealed();
  }

  const revealed = state === 'revealed' || state === 'settled';
  return (
    <section className="reveal-sec" id="home" aria-labelledby="secretTitle">
      <p className="secret" id="secretTitle" tabIndex={-1}>A little secret awaits…</p>
      <div className="card-frame">
        <div ref={card} className={`scratch-card${state === 'scratching' ? ' scratching' : ''}${revealed ? ' revealed' : ''}${state === 'settled' ? ' settled' : ''}`}>
          <DateReveal hidden={!revealed} />
          {!after && <canvas ref={cv} id="foil" role="img" aria-label="Rose gold foil. Scratch with your finger or mouse to reveal the wedding date." />}
        </div>
      </div>
      <div className="scratch-hint" style={{ opacity: revealed ? 0 : 1 }}>
        <p>Scratch the foil with your finger or mouse</p>
        <button type="button" className="textlink" onClick={reveal}>Reveal without scratching</button>
      </div>
      <div className={`after-reveal${after ? ' show' : ''}`} aria-live="polite">
        {after && <>
          <p>{wedding.date.revealLine}</p>
          <small>{wedding.date.revealSmall}</small>
          <div><a className="cue" href="#countdown" onClick={e => { e.preventDefault(); document.getElementById('countdown')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }}>Continue <i aria-hidden="true" /></a></div>
        </>}
      </div>
    </section>
  );
}
