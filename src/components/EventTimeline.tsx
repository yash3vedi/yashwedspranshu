import { wedding } from '@/config/wedding';
import { EventCard } from './EventCard';

/** Days with a sticky date marker and their event cards. */
export function EventTimeline() {
  return (
    <section className="sec" id="celebrations" aria-labelledby="celTitle">
      <header className="sec-head">
        <h2 className="sec-title" id="celTitle" data-reveal>The celebrations</h2>
        <div className="rule" aria-hidden="true"><i /></div>
        <p className="sec-sub" data-reveal style={{ ['--dl' as string]: '.15s' }}>{wedding.celebrationsSub}</p>
      </header>
      <div className="days">
        {wedding.days.map(d => (
          <div className="day" key={d.num + d.month}>
            <header className="day-mark" data-reveal>
              <span className="day-num">{d.num}</span><span className="day-month">{d.month}</span><span className="day-week">{d.week}</span>
            </header>
            <div className="day-events">
              {d.events.map((e, k) => <EventCard key={e.name} e={e} dayLabel={`${d.num} ${d.month}`} delay={k * .12} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
