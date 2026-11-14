'use client';
import { useRef, useState } from 'react';
import { wedding } from '@/config/wedding';
import { Motif } from './Motif';
import { useOnceVisible } from '@/lib/hooks';

/** Venue details + a framed, lazily loaded Google Map. */
export function VenueSection() {
  const v = wedding.venue;
  const card = useRef<HTMLDivElement>(null);
  const [loadMap, setLoadMap] = useState(false);
  useOnceVisible(card, () => setLoadMap(true), 0, '400px');
  return (
    <section className="sec" id="venue" aria-labelledby="venueTitle">
      <header className="sec-head">
        <h2 className="sec-title" id="venueTitle" data-reveal>Where we begin</h2>
        <div className="rule" aria-hidden="true"><i /></div>
      </header>
      <div className="venue">
        <div data-reveal>
          <h3 className="venue-name">{v.name}</h3>
          <p className="venue-addr">{v.address.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}</p>
          <p className="venue-note">{v.note}</p>
          <a className="btn" href={v.mapsUrl} target="_blank" rel="noopener noreferrer">Get directions</a>
        </div>
        <div className="map-frame" data-reveal style={{ ['--dl' as string]: '.2s' }}>
          <div className="map-card" ref={card}>
            <div className="map-fallback"><div><div style={{ width: 40, margin: '0 auto', color: 'var(--gold)' }}><Motif name="lotus" /></div><p>{v.name}</p></div></div>
            {loadMap && <iframe src={v.embedUrl} title={`Map showing ${v.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />}
          </div>
        </div>
      </div>
    </section>
  );
}
