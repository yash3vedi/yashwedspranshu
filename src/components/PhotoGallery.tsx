import Image from 'next/image';
import { wedding } from '@/config/wedding';
import { Monogram } from './Monogram';

const ROT = [-5, 3.5, -2, 6, -4], LIFT = [30, 0, 46, 10, 24];

/** Polaroid collage — photos come from wedding.photos. */
export function PhotoGallery() {
  return (
    <section className="sec" id="memories" aria-labelledby="memTitle">
      <header className="sec-head">
        <h2 className="sec-title" id="memTitle" data-reveal>Our memories</h2>
        <div className="rule" aria-hidden="true"><i /></div>
      </header>
      <div className="polaroids">
        {wedding.photos.map((p, i) => (
          <figure key={i} className="polaroid" data-reveal
            style={{ ['--r' as string]: `${ROT[i % 5]}deg`, ['--y' as string]: `${LIFT[i % 5]}px`, ['--dl' as string]: `${i * .12}s`, zIndex: i + 1 }}>
            <div className="ph">
              {p.src
                ? <Image src={p.src} alt={p.alt} width={1200} height={1500} loading="lazy" sizes="(max-width: 640px) 46vw, 290px" />
                : <div className="ph-empty" role="img" aria-label={`Photo placeholder ${i + 1}`}><div><Monogram size="64px" /><div>Photo {i + 1}</div></div></div>}
            </div>
            <figcaption>{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
