/* PetalSystem + ParticleSystem — one shared canvas, idles itself when empty. */
const rand = (a: number, b: number) => a + Math.random() * (b - a);

type Petal = { age: number; x: number; y: number; s: number; vy: number; vx: number; sw: number; ph: number; phs: number; rot: number; vr: number; fl: number; fls: number; a: number; sp: HTMLCanvasElement };
type Mote = { x: number; y: number; r: number; vx: number; vy: number; t: number; ttl: number; tw: number; c: string };
type Emitter = { kind: 'petal' | 'mote'; dur: number; rate: (p: number) => number; start: number; acc: number; up?: boolean; y?: () => number };

export const PETAL_COLOURS: [string, string][] = [
  ['#F6E6E2', '#DDB3AC'], ['#F3DCD6', '#D9B5B1'], ['#FBEFEA', '#E6C3BB'], ['#EFD3CB', '#C9958C'], ['#FFF8F4', '#E9CFC6'],
];

export class FX {
  private ctx: CanvasRenderingContext2D;
  private W = 0; private H = 0; private dpr = 1;
  private running = false; private last = 0;
  private petals: Petal[] = []; private motes: Mote[] = []; private emitters: Emitter[] = [];
  private sprites: HTMLCanvasElement[];
  constructor(private cv: HTMLCanvasElement, private reduced: boolean) {
    this.ctx = cv.getContext('2d')!;
    this.sprites = PETAL_COLOURS.map(([c1, c2]) => {
      const s = document.createElement('canvas'); s.width = 64; s.height = 72; const g = s.getContext('2d')!;
      const gr = g.createRadialGradient(28, 22, 2, 32, 36, 40); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
      g.fillStyle = gr; g.beginPath(); g.moveTo(32, 4);
      g.bezierCurveTo(56, 14, 60, 46, 34, 68); g.quadraticCurveTo(32, 62, 30, 68); g.bezierCurveTo(4, 46, 8, 14, 32, 4); g.fill();
      g.strokeStyle = 'rgba(185,130,122,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(32, 10); g.quadraticCurveTo(30, 38, 32, 62); g.stroke();
      return s;
    });
    this.resize = this.resize.bind(this); this.frame = this.frame.bind(this);
    this.resize(); addEventListener('resize', this.resize, { passive: true });
  }
  destroy() { removeEventListener('resize', this.resize); this.emitters = []; this.petals = []; this.motes = []; }
  private resize() { this.dpr = Math.min(devicePixelRatio || 1, 2); this.W = innerWidth; this.H = innerHeight; this.cv.width = this.W * this.dpr | 0; this.cv.height = this.H * this.dpr | 0; }
  private petal(first = false, inView = false) {
    if (this.petals.length > 70) return;
    const s = rand(11, this.W < 600 ? 19 : 24);
    this.petals.push({ age: inView ? 0 : 1, x: first ? this.W * rand(.35, .65) : rand(-20, this.W + 20), y: inView ? rand(-20, this.H * .45) : first ? rand(-10, 30) : rand(-40, -15), s, vy: rand(32, 62) * (s / 18), vx: rand(-10, 14), sw: rand(12, 34), ph: rand(0, 6.3), phs: rand(.5, 1.2),
      rot: rand(0, 6.3), vr: rand(-1, 1), fl: rand(0, 6.3), fls: rand(1.2, 2.8), a: rand(.6, .95), sp: this.sprites[Math.random() * this.sprites.length | 0] });
  }
  private mote(x?: number, y?: number, up?: boolean) {
    if (this.motes.length > 60) return;
    this.motes.push({ x: x ?? rand(0, this.W), y: y ?? rand(this.H * .4, this.H), r: rand(.6, 1.8), vx: rand(-6, 6), vy: up ? rand(-16, -5) : rand(-40, 40), t: 0, ttl: rand(2.5, 6), tw: rand(0, 6), c: Math.random() < .6 ? '201,166,107' : '232,211,168' });
  }
  private frame(ts: number) {
    const dt = Math.min((ts - (this.last || ts)) / 1000, .05); this.last = ts;
    const now = performance.now(), { ctx, dpr, W, H } = this;
    for (let i = this.emitters.length - 1; i >= 0; i--) {
      const e = this.emitters[i], p = (now - e.start) / e.dur;
      if (p >= 1) { this.emitters.splice(i, 1); continue; }
      e.acc += e.rate(p) * dt;
      while (e.acc >= 1) { e.acc--; if (e.kind === 'petal') this.petal(); else this.mote(undefined, e.y?.(), e.up); }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i]; p.age += dt; p.ph += p.phs * dt; p.fl += p.fls * dt; p.rot += p.vr * dt;
      p.y += p.vy * dt; p.x += (p.vx + Math.sin(p.ph) * p.sw) * dt;
      if (p.y > H + 40) { this.petals.splice(i, 1); continue; }
      const sx = .3 + .7 * Math.abs(Math.cos(p.fl)), c = Math.cos(p.rot), s = Math.sin(p.rot);
      ctx.globalAlpha = p.a * Math.min(1, (H + 40 - p.y) / 120) * Math.min(1, p.age / .5);
      ctx.setTransform(c * sx * dpr, s * sx * dpr, -s * dpr, c * dpr, p.x * dpr, p.y * dpr);
      ctx.drawImage(p.sp, -p.s / 2, -p.s * .56, p.s, p.s * 1.12);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = this.motes.length - 1; i >= 0; i--) {
      const m = this.motes[i]; m.t += dt; if (m.t > m.ttl) { this.motes.splice(i, 1); continue; }
      m.x += m.vx * dt; m.y += m.vy * dt; m.vy *= .995;
      const life = Math.sin(Math.PI * m.t / m.ttl), tw = .6 + .4 * Math.sin(m.t * 5 + m.tw);
      ctx.fillStyle = `rgb(${m.c})`;
      ctx.globalAlpha = .18 * life * tw; ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 3.2, 0, 6.29); ctx.fill();
      ctx.globalAlpha = .85 * life * tw; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.29); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (this.petals.length || this.motes.length || this.emitters.length) requestAnimationFrame(this.frame);
    else { this.running = false; this.last = 0; }
  }
  private go() { if (!this.running) { this.running = true; requestAnimationFrame(this.frame); } }

  /** Emit petals or motes for `dur` ms; `rate(progress 0..1)` = items per second. */
  emit(kind: 'petal' | 'mote', dur: number, rate: (p: number) => number, opts: { up?: boolean; y?: () => number } = {}) {
    if (this.reduced) return; this.emitters.push({ kind, dur, rate, start: performance.now(), acc: 0, ...opts }); this.go();
  }
  /** Petals that fade in already spread across the top of the screen — no waiting for them to fall in. */
  burst(n: number) { if (this.reduced) return; for (let i = 0; i < n; i++) this.petal(false, true); this.go(); }
  firstPetal() { if (this.reduced) return; this.petal(true); this.go(); }
  sparkle(x: number, y: number, n: number) { if (this.reduced) return; for (let i = 0; i < n; i++) this.mote(x + rand(-90, 90), y + rand(-110, 110)); this.go(); }
  stopMotes() { this.emitters = this.emitters.filter(e => e.kind !== 'mote'); }
}
export { rand };
