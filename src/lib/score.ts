/* Original generated instrumental: tanpura, bansuri, santoor, soft strings, light tabla.
   Level 0 = intimate (tanpura + bansuri), 1 = after the date reveal (+ strings, santoor), 2 = story (+ tabla). */

export interface Player { on: boolean; start(): boolean; pause(): void; setLevel(n: number): void }

// Sargam notes: S R G m P D N — '.' = lower octave, "'" = upper octave
const MELODY: [string, number][][] = [
  [['P', 1.5], ['G', .5], ['R', 1], ['G', 1]], [['P', 1], ['D', 1], ['P', 2]],
  [['G', 1], ['R', .5], ['S', .5], ['N.', 1], ['R', 1]], [['S', 4]],
  [['P', 1.5], ['G', .5], ['R', 1], ['G', 1]], [['D', 1], ["S'", 1], ['N', 1], ['D', 1]],
  [['P', 1], ['G', 1], ['R', .5], ['G', .5], ['R', 1]], [['S', 4]],
];
const CHORDS = [['S', 'G', 'P'], ['m', 'D', "S'"], ['D', "S'", "G'"], ['S', 'G', 'P'], ['S', 'G', 'P'], ['m', 'D', "S'"], ['P', 'N', "R'"], ['S', 'G', 'P']];
const TEMPO = 72;          // beats per minute
const SA = 293.66;         // tonic (D4)
const RATIOS: Record<string, number> = { S: 1, R: 9 / 8, G: 5 / 4, m: 4 / 3, P: 3 / 2, D: 5 / 3, N: 15 / 8 };

export class Score implements Player {
  on = false;
  private ctx: AudioContext | null = null;
  private master!: GainNode; private bus!: GainNode; private echo!: GainNode; private noise!: AudioBuffer;
  private level = 0; private bar = 0; private next = 0; private timer: number | null = null;

  private build() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0;
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    this.master.connect(comp).connect(c.destination);
    const len = c.sampleRate * 3.2, imp = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = imp.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    const rev = c.createConvolver(); rev.buffer = imp; const wet = c.createGain(); wet.gain.value = .42; rev.connect(wet).connect(this.master);
    this.bus = c.createGain(); this.bus.connect(this.master); this.bus.connect(rev);
    const dl = c.createDelay(1); dl.delayTime.value = .42; const fb = c.createGain(); fb.gain.value = .28; const et = c.createGain(); et.gain.value = .5;
    this.echo = c.createGain(); this.echo.connect(dl); dl.connect(fb).connect(dl); dl.connect(et); et.connect(this.bus);
    const nb = c.createBuffer(1, c.sampleRate, c.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1; this.noise = nb;
    return true;
  }
  private vol() { return [.6, .72, .78][this.level]; }
  private ramp(to: number, secs: number) {
    const t = this.ctx!.currentTime, g = this.master.gain; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(to, t + secs);
  }
  start() {
    if (!this.ctx && !this.build()) return false;
    this.ctx!.resume(); this.on = true; this.ramp(this.vol(), 3);
    if (this.timer === null) { this.next = this.ctx!.currentTime + .2; this.timer = window.setInterval(() => this.pump(), 200); }
    this.pump(); return true;
  }
  pause() {
    if (!this.ctx) return; this.on = false; this.ramp(0, .6);
    setTimeout(() => { if (!this.on) this.ctx!.suspend(); }, 700);
  }
  setLevel(n: number) { if (n <= this.level) return; this.level = n; if (this.on) this.ramp(this.vol(), 2.5); }

  private pump() {
    const c = this.ctx; if (!this.on || !c || c.state !== 'running') return;
    const BAR = 4 * 60 / TEMPO;
    if (this.next < c.currentTime) this.next = c.currentTime + .05;
    while (this.next < c.currentTime + 1.2) { this.schedule(this.bar, this.next, BAR); this.next += BAR; this.bar++; }
  }
  private f(n: string) { return SA * RATIOS[n[0]] * (n.includes("'") ? 2 : n.includes('.') ? .5 : 1); }
  private schedule(n: number, t: number, BAR: number) {
    const B = BAR / 4;
    ['P.', 'S', 'S', 'S.'].forEach((x, k) => this.tanpura(this.f(x) / 2, t + k * B));
    if (n < 1) return;
    const i = (n - 1) % 8, rest = (n - 1) % 16 >= 8 && this.level < 1 && (i === 3 || i === 7);
    let bt = 0; MELODY[i].forEach(([nt, d]) => { if (!rest) this.flute(this.f(nt) * 2, t + bt * B, d * B); bt += d; });
    if (this.level >= 1) {
      this.pad(CHORDS[i].map(x => this.f(x) / 2), t, BAR);
      [0, 2, 3, 5, 6].forEach((e, k) => this.santoor(this.f(CHORDS[i][k % 3]) * (k > 2 ? 2 : 1), t + e * B / 2, k === 0 ? .06 : .04));
    }
    if (this.level >= 2) {
      ([['dha', 0, .9], ['na', 1, .5], ['tin', 1.5, .35], ['na', 2, .5], ['dha', 3, .7], ['na', 3.5, .4]] as [string, number, number][])
        .forEach(([k, at, v]) => this.tabla(k, t + at * B, v));
    }
  }
  private env(g: GainNode, t: number, a: number, peak: number, end: number) { g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, end); }
  private tanpura(fr: number, t: number) {
    const c = this.ctx!, o = c.createOscillator(), lp = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.value = fr; lp.type = 'lowpass'; lp.frequency.setValueAtTime(2200, t); lp.frequency.exponentialRampToValueAtTime(500, t + 2.6);
    this.env(g, t, .03, .03, t + 3.4); o.connect(lp).connect(g).connect(this.bus); o.start(t); o.stop(t + 3.5);
  }
  private flute(fr: number, t: number, d: number) {
    const c = this.ctx!, o = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain(), g = c.createGain(), lp = c.createBiquadFilter();
    const lfo = c.createOscillator(), lg = c.createGain();
    o.frequency.setValueAtTime(fr * .972, t); o.frequency.exponentialRampToValueAtTime(fr, t + .09);
    o2.frequency.setValueAtTime(fr * 2 * .972, t); o2.frequency.exponentialRampToValueAtTime(fr * 2, t + .09); g2.gain.value = .12;
    lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(fr * .007, t + Math.min(d, .7) + .1);
    lfo.connect(lg); lg.connect(o.frequency);
    lp.type = 'lowpass'; lp.frequency.value = 3200;
    const end = t + d + .22;
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.15, t + .08); g.gain.linearRampToValueAtTime(.12, t + Math.max(.1, d * .85)); g.gain.linearRampToValueAtTime(.0001, end);
    o.connect(lp); o2.connect(g2).connect(lp); lp.connect(g).connect(this.bus);
    const nz = c.createBufferSource(), bp = c.createBiquadFilter(), ng = c.createGain(); nz.buffer = this.noise; nz.loop = true;
    bp.type = 'bandpass'; bp.frequency.value = fr * 2; bp.Q.value = .9; this.env(ng, t, .04, .018, t + d * .9 + .1);
    nz.connect(bp).connect(ng).connect(this.bus);
    [o, o2, lfo, nz].forEach(x => { x.start(t); x.stop(end + .05); });
  }
  private santoor(fr: number, t: number, v: number) {
    const c = this.ctx!, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.value = fr; o2.frequency.value = fr * 2.003;
    this.env(g, t, .004, v, t + 1.3); o.connect(g); o2.connect(g); g.connect(this.bus); g.connect(this.echo);
    o.start(t); o2.start(t); o.stop(t + 1.4); o2.stop(t + 1.4);
  }
  private pad(fs: number[], t: number, d: number) {
    const c = this.ctx!, lp = c.createBiquadFilter(), g = c.createGain(); lp.type = 'lowpass'; lp.frequency.value = 850;
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.022, t + 1.2); g.gain.linearRampToValueAtTime(.018, t + d); g.gain.linearRampToValueAtTime(.0001, t + d + 1.3);
    lp.connect(g).connect(this.bus);
    fs.forEach(fr => [-7, 7].forEach(dt => { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fr; o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + d + 1.4); }));
  }
  private tabla(k: string, t: number, v: number) {
    const c = this.ctx!, o = c.createOscillator(), g = c.createGain();
    if (k === 'dha') { o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(68, t + .28); this.env(g, t, .005, .16 * v, t + .45); }
    else { o.type = 'triangle'; o.frequency.setValueAtTime(k === 'na' ? 540 : 680, t); this.env(g, t, .002, .06 * v, t + (k === 'na' ? .16 : .1)); }
    o.connect(g).connect(this.bus); o.start(t); o.stop(t + .5);
  }
}

/** Plays a recorded track instead (set wedding.music.src). */
export class FilePlayer implements Player {
  on = false; private a: HTMLAudioElement; private fi: number | undefined;
  constructor(src: string) { this.a = new Audio(src); this.a.loop = true; this.a.preload = 'none'; this.a.volume = 0; }
  private fade(to: number, ms: number) {
    clearInterval(this.fi); const from = this.a.volume, st = performance.now();
    this.fi = window.setInterval(() => { const p = Math.min(1, (performance.now() - st) / ms); this.a.volume = from + (to - from) * p; if (p === 1) { clearInterval(this.fi); if (!to) this.a.pause(); } }, 50);
  }
  start() { this.on = true; this.a.play().catch(() => {}); this.fade(.8, 2500); return true; }
  pause() { this.on = false; this.fade(0, 600); }
  setLevel() {}
}
