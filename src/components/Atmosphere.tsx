/** Ambient light, botanical shadows and paper grain — purely decorative. */
const Branch = ({ full }: { full?: boolean }) => (
  <>
    <path d="M400 0C330 40 260 90 210 160 170 215 140 280 120 360l6 2c20-78 50-142 90-196 48-66 115-115 184-154z" />
    <path d="M300 60c-40-10-80 5-95 40 38 12 76-3 95-40zM262 110c-4-42 20-78 58-86 4 40-20 76-58 86zM230 150c-40-6-74 16-84 52 40 6 72-16 84-52zM196 200c-10-40 8-80 44-94 12 40-6 78-44 94z" />
    {full && <path d="M168 250c-38-14-78 2-96 36 38 14 78-2 96-36zM150 300c-14-38-2-80 32-100 16 38 4 78-32 100z" />}
  </>
);
export function Atmosphere() {
  return (
    <>
      <div className="atmos" aria-hidden="true">
        <div className="glow g1" /><div className="glow g2" />
        <svg className="leaf leaf-a" viewBox="0 0 400 400" fill="currentColor"><Branch full /></svg>
        <svg className="leaf leaf-b" viewBox="0 0 400 400" fill="currentColor"><Branch /></svg>
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
