import type { EventItem } from '@/config/wedding';
import { Motif } from './Motif';

/** One arch-shaped event card. */
export function EventCard({ e, dayLabel, delay }: { e: EventItem; dayLabel: string; delay: number }) {
  return (
    <article className={`event ${e.variant ?? ''}`} data-reveal style={{ ['--dl' as string]: `${delay}s` }}>
      <div className="ev-motif"><Motif name={e.motif} /></div>
      <h3 className="ev-name">{e.name}</h3>
      <p className="ev-time"><span className="sr-only">{dayLabel}, </span>{e.time}</p>
      {e.desc && <p className="ev-desc">{e.desc}</p>}
      {e.dress && <div className="badge"><small>Dress code</small><b>{e.dress}</b></div>}
      {e.note && <p className="ev-note">{e.note}</p>}
    </article>
  );
}
