import { wedding } from '@/config/wedding';
import { Monogram } from './Monogram';

/** The content hidden under the foil: 09 / December / 2026 + monogram. */
export function DateReveal({ hidden }: { hidden: boolean }) {
  const { day, month, year } = wedding.date;
  return (
    <div className="date-under" aria-hidden={hidden}>
      <div className="du">
        <div className="d-day">{day}</div>
        <div className="d-month">{month}</div>
        <div className="d-year">{year}</div>
      </div>
      <div className="d-mono"><Monogram size="58px" /></div>
    </div>
  );
}
