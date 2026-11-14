import type { MotifName } from '@/config/wedding';

/** Fine line-art motifs (currentColor). Each event card picks one by name. */
const ring = (n: number, r: number, fn: (x: number, y: number, a: number, i: number) => React.ReactNode) =>
  Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2 - Math.PI / 2; return fn(24 + Math.cos(a) * r, 24 + Math.sin(a) * r, a, i); });

const shapes: Record<MotifName, React.ReactNode> = {
  lotus: <>
    <path d="M24 9c4.5 5.5 5 12 0 21-5-9-4.5-15.5 0-21z" /><path d="M24 30c-2.5-6.5-8.5-11-15.5-11 0 7.5 6.5 11.5 15.5 11z" />
    <path d="M24 30c2.5-6.5 8.5-11 15.5-11 0 7.5-6.5 11.5-15.5 11z" /><path d="M9 35.5c7 2.5 23 2.5 30 0" /></>,
  diya: <>
    <path d="M24 25c-3.4-3.2-3.4-8 0-13.5 3.4 5.5 3.4 10.3 0 13.5z" /><path d="M24 22.5c-1-1-1-2.6 0-4.4 1 1.8 1 3.4 0 4.4z" />
    <path d="M8 29h32c-2 6.5-8.5 10-16 10S10 35.5 8 29z" /><path d="M18 39.5l-2 3h16l-2-3" /></>,
  marigold: <>
    <circle cx="24" cy="24" r="3.4" />
    {ring(10, 8.5, (x, y, _a, i) => <circle key={'a' + i} cx={x} cy={y} r="3.3" />)}
    {ring(16, 15.5, (x, y, _a, i) => <circle key={'b' + i} cx={x} cy={y} r="2.3" />)}</>,
  sangeet: <>
    <path d="M4 30c3.3-7 6.7-7 10 0s6.7 7 10 0 6.7-7 10 0 6.7 7 10 0" /><path d="M34 6v10M29 11h10" /><path d="M14 12v5M11.5 14.5h5" />
    <circle cx="24" cy="40" r=".6" fill="currentColor" /></>,
  rings: <>
    <circle cx="19" cy="28" r="9.5" /><circle cx="29" cy="28" r="9.5" /><path d="M24 9.5l3.2 3.3-3.2 3.3-3.2-3.3z" /><path d="M24 16.1v2.4" /></>,
  toran: <>
    <path d="M3 11c7 7 14 7 21 0 7 7 14 7 21 0" />
    {[8, 16, 24, 32, 40].map((x, i) => { const y = 11 + (i === 2 ? 0 : (i % 2 ? 5.2 : 3)); const len = i === 2 ? 15 : 10;
      return <g key={x}><path d={`M${x} ${y}v${len}`} /><path d={`M${x} ${y + len}c-2.2 2.4-2.2 4.4 0 6.4 2.2-2 2.2-4 0-6.4z`} /></g>; })}</>,
  reception: <>
    <circle cx="24" cy="24" r="4.5" /><circle cx="24" cy="24" r="10" strokeDasharray=".5 3" />
    {ring(12, 0, (_x, _y, a, i) => { const r2 = i % 3 === 0 ? 21 : 18.5;
      return <path key={i} d={`M${24 + Math.cos(a) * 14} ${24 + Math.sin(a) * 14}L${24 + Math.cos(a) * r2} ${24 + Math.sin(a) * r2}`} />; })}</>,
  phere: <>
    <circle cx="24" cy="24" r="20" strokeWidth=".7" opacity=".7" /><path d="M24 17c3 3.8 4 6.8 4 8.8a4 4 0 0 1-8 0c0-2 1-5 4-8.8z" />
    {ring(7, 14, (x, y, _a, i) => <circle key={i} cx={x} cy={y} r="1.1" fill="currentColor" stroke="none" />)}</>,
};

export function Motif({ name }: { name: MotifName }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shapes[name] ?? shapes.lotus}
    </svg>
  );
}
